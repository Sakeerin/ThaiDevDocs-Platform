import { DocsSponsorSidebar } from '@/components/docs-sponsor-sidebar';

export function SponsorSidebarPreview() {
  return (
    <div className="rounded-2xl border bg-fd-muted/20 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-fd-muted-foreground">
        Preview — docs sidebar placement
      </p>
      <div className="mx-auto max-w-xs rounded-xl border bg-fd-background p-4 shadow-sm">
        <p className="text-xs font-medium text-fd-muted-foreground">On this page</p>
        <div className="mt-3 space-y-2 text-sm text-fd-muted-foreground">
          <p>• Introduction</p>
          <p>• Setup</p>
          <p className="font-medium text-foreground">• Example</p>
        </div>
        <div className="mt-4 border-t pt-4">
          <DocsSponsorSidebar compact />
        </div>
      </div>
    </div>
  );
}
