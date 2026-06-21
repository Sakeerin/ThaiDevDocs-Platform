declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

export type PlausibleEvent =
  | 'article_view'
  | 'search_query'
  | 'ai_question'
  | 'helpful_vote';

export function trackPlausibleEvent(
  event: PlausibleEvent,
  props?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined' || !window.plausible) {
    return;
  }

  window.plausible(event, props ? { props } : undefined);
}

export function getPlausibleDomain() {
  return process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
}
