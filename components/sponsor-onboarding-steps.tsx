import { SPONSOR_ONBOARDING_STEPS } from '@/lib/sponsor-packages';

export function SponsorOnboardingSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2">
      {SPONSOR_ONBOARDING_STEPS.map((item) => (
        <li key={item.step} className="rounded-xl border p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-fd-primary">
            Step {item.step}
          </p>
          <p className="mt-2 font-semibold">{item.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-fd-muted-foreground">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
