const DEV_PRO_LOGINS = (process.env.DEV_PRO_GITHUB_LOGINS ?? '')
  .split(',')
  .map((value) => value.trim().toLowerCase())
  .filter(Boolean);

export function isDevProLogin(login?: string | null) {
  if (!login) return false;
  return DEV_PRO_LOGINS.includes(login.toLowerCase());
}

export function isDevProEnabled() {
  return process.env.NEXT_PUBLIC_DEV_PRO === 'true';
}
