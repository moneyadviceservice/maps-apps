import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { COOKIE_PREFERENCE_HASH } from '../components/CookieBanner/cookieBannerConfig';
import {
  applyConsent,
  createConsent,
  DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG,
  getStoredConsent,
  syncStoredConsentWhenReady,
} from '../utils/cookies/mpsCookieUtils';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const LEGAL_SECTION_TITLE_PATTERN = /^legal$|^cyfreithiol$/i;
const COOKIE_POLICY_LINK_PATTERN = /cookie[-_]?policy/i;
const FOOTER_LINK_CLASS_NAME =
  'no-underline text-sm text-white visited:text-gray-100 hover:text-green-300 hover:underline transition-colors duration-200';
const INJECTED_COOKIE_PREFERENCES_ATTR = 'data-mps-cookie-preferences-link';

const isCookiePolicyLink = (href: string, text: string): boolean =>
  COOKIE_POLICY_LINK_PATTERN.test(href) ||
  COOKIE_POLICY_LINK_PATTERN.test(text);

const injectFooterCookiePreferencesLink = (
  label: string,
): (() => void) | null => {
  const footer = document.querySelector('footer[data-testid]');

  if (!footer) {
    return null;
  }

  if (footer.querySelector(`a[href*="${COOKIE_PREFERENCE_HASH}"]`)) {
    return () => undefined;
  }

  const headings = footer.querySelectorAll('h3');

  for (const heading of headings) {
    if (!LEGAL_SECTION_TITLE_PATTERN.test(heading.textContent?.trim() ?? '')) {
      continue;
    }

    const section = heading.parentElement;
    const list = section?.querySelector('ul');

    if (!list) {
      continue;
    }

    const links = list.querySelectorAll('a');

    for (const link of links) {
      const href = link.getAttribute('href') ?? '';
      const text = link.textContent ?? '';

      if (!isCookiePolicyLink(href, text)) {
        continue;
      }

      const listItem = link.closest('li');

      if (!listItem) {
        continue;
      }

      const preferencesListItem = document.createElement('li');
      const preferencesLink = document.createElement('a');

      preferencesLink.href = COOKIE_PREFERENCE_HASH;
      preferencesLink.textContent = label;
      preferencesLink.className = FOOTER_LINK_CLASS_NAME;
      preferencesLink.setAttribute(INJECTED_COOKIE_PREFERENCES_ATTR, 'true');
      preferencesListItem.appendChild(preferencesLink);
      listItem.after(preferencesListItem);

      return () => {
        preferencesListItem.remove();
      };
    }
  }

  return null;
};

export type UseCookieBannerResult = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  isMounted: boolean;
  isOpen: boolean;
  analyticsChecked: boolean;
  setAnalyticsChecked: (checked: boolean) => void;
  marketingChecked: boolean;
  setMarketingChecked: (checked: boolean) => void;
  handleReject: () => void;
  handleSave: () => void;
  handleAcceptAll: () => void;
  handleButtonKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    action: () => void,
  ) => void;
};

export const useCookieBanner = (): UseCookieBannerResult => {
  const { z } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [analyticsChecked, setAnalyticsChecked] = useState(false);
  const [marketingChecked, setMarketingChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { consentDays } = DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG;

  const syncCheckboxStateFromStoredConsent = useCallback(() => {
    const storedConsent = getStoredConsent(document.cookie);

    if (storedConsent) {
      setAnalyticsChecked(storedConsent.analytics);
      setMarketingChecked(storedConsent.marketing);
    }
  }, []);

  const openDialog = useCallback(() => {
    syncCheckboxStateFromStoredConsent();

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    dialog.showModal();
    dialog.setAttribute('aria-modal', 'true');
    setIsOpen(true);

    requestAnimationFrame(() => {
      dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    });
  }, [syncCheckboxStateFromStoredConsent]);

  const closeDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    dialog.close();
    dialog.setAttribute('aria-modal', 'false');
    setIsOpen(false);
  }, []);

  const persistConsent = useCallback(
    (analytics: boolean, marketing: boolean) => {
      const consent = createConsent(analytics, marketing, consentDays);
      applyConsent(consent, DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG);
      setAnalyticsChecked(analytics);
      setMarketingChecked(marketing);
      closeDialog();
    },
    [closeDialog, consentDays],
  );

  const handleReject = useCallback(() => {
    persistConsent(false, false);
  }, [persistConsent]);

  const handleSave = useCallback(() => {
    persistConsent(analyticsChecked, marketingChecked);
  }, [analyticsChecked, marketingChecked, persistConsent]);

  const handleAcceptAll = useCallback(() => {
    persistConsent(true, true);
  }, [persistConsent]);

  const handleButtonKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, action: () => void) => {
      if (event.code === 'Space') {
        event.preventDefault();
        action();
      }
    },
    [],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const storedConsent = getStoredConsent(document.cookie);

    if (storedConsent) {
      setAnalyticsChecked(storedConsent.analytics);
      setMarketingChecked(storedConsent.marketing);

      const cancelSync = syncStoredConsentWhenReady(
        DEFAULT_COOKIE_BANNER_TECHNICAL_CONFIG,
        document.cookie,
      );

      if (globalThis.location.hash.includes(COOKIE_PREFERENCE_HASH)) {
        openDialog();
      }

      return cancelSync;
    }

    openDialog();
  }, [isMounted, openDialog]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const label = z({
      en: 'Cookie preferences',
      cy: 'Dewisiadau cwcis',
    });
    let cleanupInjectedLink: (() => void) | undefined;

    const tryInjectFooterLink = () => {
      if (cleanupInjectedLink) {
        return;
      }

      const cleanup = injectFooterCookiePreferencesLink(label);

      if (cleanup) {
        cleanupInjectedLink = cleanup;
        observer.disconnect();
      }
    };

    const observer = new MutationObserver(tryInjectFooterLink);

    tryInjectFooterLink();
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanupInjectedLink?.();
    };
  }, [isMounted, z]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const handlePreferenceLinkClick = (event: Event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest(`a[href*="${COOKIE_PREFERENCE_HASH}"]`);

      if (!link) {
        return;
      }

      event.preventDefault();
      openDialog();
    };

    document.addEventListener('click', handlePreferenceLinkClick);

    return () => {
      document.removeEventListener('click', handlePreferenceLinkClick);
    };
  }, [isMounted, openDialog]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const focusableElements =
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable?.focus();
        event.preventDefault();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable?.focus();
        event.preventDefault();
      }
    };

    const handleEscapeKey = (event: globalThis.KeyboardEvent) => {
      if (event.code === 'Escape') {
        event.preventDefault();
      }
    };

    dialog.addEventListener('keydown', handleEscapeKey);
    focusableElements.forEach((element) => {
      element.addEventListener('keydown', handleTabKey);
    });

    return () => {
      dialog.removeEventListener('keydown', handleEscapeKey);
      focusableElements.forEach((element) => {
        element.removeEventListener('keydown', handleTabKey);
      });
    };
  }, [isOpen]);

  return {
    dialogRef,
    isMounted,
    isOpen,
    analyticsChecked,
    setAnalyticsChecked,
    marketingChecked,
    setMarketingChecked,
    handleReject,
    handleSave,
    handleAcceptAll,
    handleButtonKeyDown,
  };
};
