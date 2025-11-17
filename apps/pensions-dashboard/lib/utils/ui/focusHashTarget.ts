const allowedValues = new Set(['#help-and-support', '#top', '#no-income']);

/**
 * Function to focus a hash target when using jump links
 */
export const focusHashTarget = () => {
  if (typeof window !== 'undefined') {
    const isHashAllowed = allowedValues.has(window.location.hash);
    if (isHashAllowed) {
      const element = document.getElementById(window.location.hash.slice(1));
      if (element) {
        element.focus();
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }
};
