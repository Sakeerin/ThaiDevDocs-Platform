import { anthropic } from '@ai-sdk/anthropic';
import { streamText, type UIMessage } from 'ai';
import { getSession } from '@/lib/auth';
import { buildRagContext } from '@/lib/rag/load-sections';
import { searchRagSections } from '@/lib/rag/search';
import { AI_SYSTEM_PROMPT } from '@/lib/rag/types';
import { getAiUsage, incrementAiUsage } from '@/lib/rate-limit';
import { getSubscriptionStatus } from '@/lib/subscription';
import { trackPlausibleEvent } from '@/lib/plausible';
import { isApiConfigured } from '@/lib/api-client';

export const maxDuration = 60;

type AiRequestBody = {
  messages: UIMessage[];
  articleSlug?: string;
};

function getLastUserQuestion(messages: UIMessage[]) {
  const lastUser = [...messages].reverse().find((message) => message.role === 'user');
  if (!lastUser) return '';

  return lastUser.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

function getUserKey(session: Awaited<ReturnType<typeof getSession>>) {
  return session?.user?.login ?? session?.user?.email ?? session?.user?.id ?? 'anonymous';
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user) {
    return Response.json({ error: 'login_required' }, { status: 401 });
  }

  const subscription = await getSubscriptionStatus();

  if (!subscription.isPro) {
    return Response.json({ error: 'pro_required' }, { status: 403 });
  }

  const userKey = getUserKey(session);
  const usage = await getAiUsage(userKey);

  if (usage.remaining <= 0) {
    return Response.json(
      { error: 'rate_limited', used: usage.used, limit: usage.limit },
      { status: 429 },
    );
  }

  const body = (await request.json()) as AiRequestBody;
  const question = getLastUserQuestion(body.messages);

  if (!question) {
    return Response.json({ error: 'question_required' }, { status: 400 });
  }

  if (isApiConfigured() && session.user.apiToken) {
    const apiResponse = await fetch(`${process.env.API_URL}/api/ai/qa`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.user.apiToken}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({ question, article_slug: body.articleSlug }),
    });

    if (apiResponse.ok && apiResponse.body) {
      await incrementAiUsage(userKey);
      trackPlausibleEvent('ai_question', { page: body.articleSlug ?? 'global', mode: 'laravel' });
      return new Response(apiResponse.body, {
        headers: {
          'Content-Type': apiResponse.headers.get('Content-Type') ?? 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
    }
  }

  const sections = await searchRagSections(question, {
    articleSlug: body.articleSlug,
    limit: 5,
  });

  if (sections.every((section) => section.score <= 0.1)) {
    return Response.json({ error: 'no_relevant_content' }, { status: 404 });
  }

  const context = buildRagContext(sections);
  const increment = await incrementAiUsage(userKey);

  if (!increment.allowed) {
    return Response.json(
      { error: 'rate_limited', used: increment.used, limit: increment.limit },
      { status: 429 },
    );
  }

  trackPlausibleEvent('ai_question', {
    page: body.articleSlug ?? 'global',
    mode: 'local-rag',
    sources: sections.map((section) => section.url).join(','),
  });

  const result = streamText({
    model: anthropic(process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514'),
    system: AI_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Context จาก ThaiDevDocs:\n\n${context}\n\n---\n\nคำถาม: ${question}`,
      },
    ],
  });

  return result.toUIMessageStreamResponse({
    headers: {
      'X-AI-Sources': JSON.stringify(
        sections.map((section) => ({
          title: section.title,
          heading: section.heading,
          url: section.url,
        })),
      ),
    },
  });
}
