import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.mdx`,
  `${docsContentRoute}{/*path}/content.md`,
);

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/profile')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const suffixRewrite = rewriteSuffix(request.nextUrl.pathname);
  if (suffixRewrite) {
    return NextResponse.rewrite(new URL(suffixRewrite, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const docsRewrite = rewriteDocs(request.nextUrl.pathname);

    if (docsRewrite) {
      return NextResponse.rewrite(new URL(docsRewrite, request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
