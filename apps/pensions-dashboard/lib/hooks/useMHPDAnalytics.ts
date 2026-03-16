/* eslint-disable no-console */
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { PensionsAnalytics } from '../api/pension-data-service';
import { useAnalyticsProvider } from '../contexts/AnalyticsContext';

type MHPDAnalyticsProps = {
  eventName?: string;
  pageTitle?: string;
  pageName?: string;
  isDashboard?: boolean;
  searchResults?: PensionsAnalytics;
};

export const useMHPDAnalytics = ({
  eventName = 'pageLoadReact',
  pageTitle = 'Moneyhelper Pensions Dashboard',
  pageName,
  isDashboard = true,
  searchResults,
}: MHPDAnalyticsProps = {}) => {
  const { addEvent } = useAnalytics();
  const { locale } = useTranslation();
  const router = useRouter();
  const { userSessionId } = useAnalyticsProvider();

  useEffect(() => {
    const data = {
      event: eventName,
      page: {
        pageTitle,
        pageName: `moneyhelper-pensions-dashboard${
          pageName ? `--${pageName.toLowerCase().replaceAll(/\s+/g, '-')}` : ''
        }`,
        categoryLevels: [
          'MHPD',
          isDashboard ? 'Dashboard post Finder' : 'Entry pre Finder',
        ],
        lang: locale,
        site: 'Moneyhelper Pensions Dashboard',
        pageType: 'MHPD Journey',
        source: 'direct',
        url: router.asPath,
      },
      tool: {
        toolName: 'Moneyhelper Pensions Dashboard',
        toolCategory: '',
        toolStep: 1,
        stepName: '',
      },
      user: {
        loggedIn: !!userSessionId,
        userId: '',
        sessionId: userSessionId || '',
      },
      ...(searchResults && { searchResults }),
    };

    // When running locally, only log - don't send analytics event
    if (process.env.NODE_ENV !== 'production') {
      console.log(`MHPD Analytics Event (local - not sent):`, data);
      return;
    }

    console.log(`MHPD Analytics Event:`, data);
    addEvent(data);
  }, [
    addEvent,
    locale,
    router.asPath,
    userSessionId,
    pageName,
    pageTitle,
    isDashboard,
    eventName,
    searchResults,
  ]);
};
