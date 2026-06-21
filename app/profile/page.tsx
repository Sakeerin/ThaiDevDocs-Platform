import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { userContributedToArticle } from '@/lib/article-utils';
import { source } from '@/lib/source';

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login?callbackUrl=/profile');
  }

  const username = session.user.login ?? session.user.name ?? '';
  const pages = source.getPages().filter((page) =>
    userContributedToArticle(username, page.data),
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-fd-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{username}</span>
        </p>
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="size-16 rounded-full border"
          />
        ) : null}
      </header>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Contributed articles</h2>
          <p className="text-sm text-fd-muted-foreground">
            บทความที่คุณเป็น author หรือ contributor ตาม frontmatter
          </p>
        </div>

        {pages.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-fd-muted-foreground">
            ยังไม่พบบทความที่ match กับ GitHub username ของคุณ — ตั้ง{' '}
            <code className="rounded bg-fd-muted px-1">author</code> หรือ{' '}
            <code className="rounded bg-fd-muted px-1">contributors</code> ใน frontmatter ให้ตรง
            หรือเริ่ม contribute ที่{' '}
            <Link href="/contribute" className="text-fd-primary underline">
              Contribution guide
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {pages.map((page) => (
              <li key={page.url}>
                <Link
                  href={page.url}
                  className="block rounded-xl border p-4 transition-colors hover:bg-fd-muted/40"
                >
                  <p className="font-medium">{page.data.title}</p>
                  <p className="mt-1 text-sm text-fd-muted-foreground">{page.data.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
