import { useEffect, useEffectEvent, useRef, useState } from 'react';

// Avoid circular dependency by defining status types locally
export enum SUMMARY_STATUS {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  BALANCED = 'balanced',
}

// Avoid circular dependency by duplicating formatCurrency locally
const formatCurrency = (amount: number | string): string => {
  const nAmount = Number(amount);

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let formattedAmount = formatter.format(Math.abs(nAmount));

  if (nAmount < 0) {
    formattedAmount = `-${formattedAmount}`;
  }

  return formattedAmount;
};

type UseSummaryAnnouncementsProps = {
  income: number;
  spending: number;
  balance: number;
  status: SUMMARY_STATUS;
  t: (key: string) => string;
};

export const useSummaryAnnouncements = ({
  income,
  spending,
  balance,
  status,
  t,
}: UseSummaryAnnouncementsProps) => {
  const previousIncomeRef = useRef<number | null>(null);
  const previousSpendingRef = useRef<number | null>(null);
  const previousBalanceRef = useRef<number | null>(null);
  const initialAnnouncementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const announcementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasJSRef = useRef(false);

  const generateAnnouncementText = (): string => {
    const incomeLabel = t('summaryTotal.income');
    const costsLabel = t('summaryTotal.spending');
    const balanceLabel = t('summaryTotal.balance');

    let statusText = '';
    if (status === SUMMARY_STATUS.NEGATIVE) {
      statusText = t('summaryTotal.announcements.overspending');
    } else if (status === SUMMARY_STATUS.POSITIVE) {
      statusText = t('summaryTotal.announcements.onTrack');
    } else {
      statusText = t('summaryTotal.aria.statusBalanced');
    }

    return `${incomeLabel} ${formatCurrency(
      income,
    )}, ${costsLabel} ${formatCurrency(
      spending,
    )}, ${balanceLabel} ${formatCurrency(balance)}. ${statusText}`;
  };

  const generateUpdatedAnnouncementText = useEffectEvent(() => {
    const summaryText = t('summaryTotal.announcements.summaryUpdated');
    return `${summaryText}. ${generateAnnouncementText()}`;
  });

  // generate server-side announcement
  const initialAnnouncement =
    income > 0 || spending > 0 ? generateAnnouncementText() : '';

  const [announcement, setAnnouncement] = useState(initialAnnouncement);

  useEffect(() => {
    // Mark that JS is enabled and clear server-side announcement
    if (!hasJSRef.current) {
      hasJSRef.current = true;

      // This prevents it from being read twice when JS is enabled
      if (initialAnnouncement) {
        initialAnnouncementTimeoutRef.current = setTimeout(() => {
          setAnnouncement('');
          initialAnnouncementTimeoutRef.current = null;
        }, 100);
      }
    }

    // Skip announcement tracking on initial mount
    if (previousIncomeRef.current === null) {
      previousIncomeRef.current = income;
      previousSpendingRef.current = spending;
      previousBalanceRef.current = balance;
      return;
    }

    if (
      previousIncomeRef.current !== income ||
      previousSpendingRef.current !== spending ||
      previousBalanceRef.current !== balance
    ) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
        announcementTimeoutRef.current = null;
      }

      // Clear any existing announcement immediately to prevent interruptions
      setAnnouncement('');

      // Debounce: Wait for user to stop typing before announcing
      // 300ms is long enough to avoid interrupting fast typing
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setAnnouncement(generateUpdatedAnnouncementText());

        // Clear announcement after screen reader has had time to read it
        announcementTimeoutRef.current = setTimeout(() => {
          setAnnouncement('');
          announcementTimeoutRef.current = null;
        }, 3000);
      }, 300);

      previousIncomeRef.current = income;
      previousSpendingRef.current = spending;
      previousBalanceRef.current = balance;
    }

    // @note: `eslint-plugin-react-hooks` needs updating to support `exhaustive-deps` correctly with `useEffectEvent`
    // (currently v5.2.0 as of October 2026, needs to be updated to v6.1.0 or later)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, spending, balance, status, t, initialAnnouncement]);

  useEffect(
    () => () => {
      if (initialAnnouncementTimeoutRef.current) {
        clearTimeout(initialAnnouncementTimeoutRef.current);
        initialAnnouncementTimeoutRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current);
        announcementTimeoutRef.current = null;
      }
    },
    [],
  );

  return { announcement, initialAnnouncement };
};
