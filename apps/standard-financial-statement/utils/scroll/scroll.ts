export const ERROR_SUMMARY_ID = 'error-summary-container';

/** Runs after the next paint so scroll targets exist in the layout. */
export const afterLayout = (callback: () => void): void => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

/** Scroll to the error summary after validation; called from an effect, not inline in handlers. */
export const scrollToErrorSummary = (): void => {
  const errorContainer = document.getElementById(ERROR_SUMMARY_ID);
  if (!errorContainer) return;

  errorContainer.focus();
  errorContainer.scrollIntoView({ behavior: 'auto', block: 'start' });
};

/** Scroll to an element and move focus for screen readers. */
export const scrollElementIntoView = (element: HTMLElement): void => {
  element.scrollIntoView({ behavior: 'auto', block: 'start' });

  if (element.hasAttribute('tabindex')) {
    element.focus();
    return;
  }

  element.setAttribute('tabindex', '-1');
  element.focus();
  element.removeAttribute('tabindex');
};

/** Scroll to a hash target by id. */
export const scrollToHashRegion = (hash: string): boolean => {
  const element = document.getElementById(hash.replace('#', ''));
  if (!element) return false;

  scrollElementIntoView(element);
  return true;
};

/** Scroll once the hash target is in the DOM (e.g. after a form step swap). */
export const scrollToHashWhenReady = (hash: string): void => {
  afterLayout(() => {
    if (scrollToHashRegion(hash)) return;

    requestAnimationFrame(() => {
      scrollToHashRegion(hash);
    });
  });
};
