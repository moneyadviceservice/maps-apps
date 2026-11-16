/**
 * Formats a URL to remove any query parameters added by Cloudflare challenges.
 *
 * These query parameters may be added automatically by any remote site with
 * Cloudflare protection enabled, which includes the MoneyHelper website. As
 * such, if one of these parameters exists when testing outbound links, that
 * test will fail.
 *
 * As the parameters are dynamic and do not invalidate the correctness of the
 * rest of the URL, they are safe to ignore when testing.
 *
 * @param inputUrl  URL to be stripped of Cloudflare challenge query parameters
 * @returns         URL with stripped query parameters
 */
export const stripCloudflareChallengeFromUrl = (
  inputUrl: string | URL,
): string => {
  const outputUrl = new URL(inputUrl.toString());
  const paramsToDelete: string[] = [];

  outputUrl.searchParams.forEach((_paramValue, paramKey) => {
    if (paramKey.startsWith('__cf_chl')) {
      paramsToDelete.push(paramKey);
    }
  });

  paramsToDelete.forEach((param) => outputUrl.searchParams.delete(param));

  return outputUrl.href;
};
