const apiUrl = process.env.API_URL?.replace(/\/$/, '');

export function getApiUrl() {
  return apiUrl;
}

export function isApiConfigured() {
  return Boolean(apiUrl);
}

export async function syncUserWithApi(input: {
  githubId: string;
  login: string;
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
}) {
  if (!apiUrl) {
    return null;
  }

  const response = await fetch(`${apiUrl}/api/auth/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Api-Secret': process.env.API_SYNC_SECRET ?? '',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as {
    token: string;
    is_pro: boolean;
  };
}

export async function fetchAiUsage(token: string) {
  if (!apiUrl) return null;

  const response = await fetch(`${apiUrl}/api/ai/usage`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  return response.json() as Promise<{ used: number; remaining: number; limit: number }>;
}
