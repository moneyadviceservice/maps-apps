export const getPostLogoutRedirectUri = (referer?: string): string => {
  if (!referer) return '/';

  try {
    const url = new URL(referer);

    if (url.pathname.includes('/admin')) {
      const parts = url.pathname.split('/');
      const adminIndex = parts.indexOf('admin');
      const truncatedPath = parts.slice(0, adminIndex + 1).join('/') + '/';
      return `${url.origin}${truncatedPath}`;
    }

    return `${url.origin}/`;
  } catch {
    return '/';
  }
};
