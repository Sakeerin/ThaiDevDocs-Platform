import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { isDevProEnabled, isDevProLogin } from '@/lib/pro-access';
import { syncUserWithApi } from '@/lib/api-client';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile && 'login' in profile) {
        token.login = profile.login as string;
      }

      if (account?.provider === 'github' && profile && 'id' in profile) {
        const login = ('login' in profile ? profile.login : token.login) as string | undefined;
        const synced = await syncUserWithApi({
          githubId: String(profile.id),
          login: login ?? 'unknown',
          name: typeof profile.name === 'string' ? profile.name : null,
          email: typeof profile.email === 'string' ? profile.email : null,
          avatar: typeof profile.image === 'string' ? profile.image : null,
        });

        if (synced) {
          token.apiToken = synced.token;
          token.isPro = synced.is_pro;
        } else if (isDevProLogin(login)) {
          token.isPro = true;
        }
      }

      if (isDevProEnabled()) {
        token.isPro = true;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.login = (token.login as string | undefined) ?? session.user.name ?? undefined;
        session.user.isPro = Boolean(token.isPro);
        session.user.apiToken = token.apiToken as string | undefined;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function isAuthConfigured() {
  return Boolean(
    process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET &&
      process.env.NEXTAUTH_SECRET,
  );
}
