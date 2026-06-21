export const appName = 'ThaiDevDocs';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'Sakeerin',
  repo: 'ThaiDevDocs-Platform',
  branch: 'main',
};

export const contentDocsPath = 'content/docs';

export function getGitHubBlobUrl(pagePath: string) {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${contentDocsPath}/${pagePath}`;
}

export function getGitHubEditUrl(pagePath: string) {
  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/edit/${gitConfig.branch}/${contentDocsPath}/${pagePath}`;
}

export function getSuggestUpdateIssueUrl(title: string, pageUrl: string) {
  const params = new URLSearchParams({
    title: `[Suggest Update] ${title}`,
    template: 'suggest-update',
    page_url: pageUrl,
    page_title: title,
  });

  return `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues/new?${params.toString()}`;
}
