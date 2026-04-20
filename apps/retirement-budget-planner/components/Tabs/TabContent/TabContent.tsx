import { ReactNode, RefObject } from 'react';

import { RealTimeSummary } from 'components/RealTimeSummary';
import { VisibleSection } from 'components/VisibleSection';
import { SummaryContextProvider } from 'context/SummaryContextProvider/SummaryContextProvider';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { SummaryType } from 'lib/types/summary.type';
import { ErrorMap } from 'lib/util/aboutYou/aboutYou';

import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  children: ReactNode;
  title: string;
  tabName: PAGES_NAMES;
  hasError: boolean;
  errorSummaryRef: RefObject<HTMLDivElement>;
  summaryData?: SummaryType;
  description?: ReactNode;
  errorDetails?: ErrorMap | null;
};

const TabContent = ({
  children,
  title,
  tabName,
  summaryData,
  description,
  hasError,
  errorSummaryRef,
  errorDetails,
}: Props) => {
  const { t } = useTranslation();
  const makeSummaryTotalVisible =
    tabName !== PAGES_NAMES.ABOUTYOU && tabName !== PAGES_NAMES.SUMMARY;

  const shouldShowTopLevelError = (
    tabName: string,
    hasError: boolean,
  ): boolean => tabName !== PAGES_NAMES.ABOUTYOU && hasError;

  const errorTitle = [PAGES_NAMES.INCOME, PAGES_NAMES.ESSENTIALS].includes(
    tabName,
  )
    ? t('errorSummary.title.moreInformation')
    : t('errorSummary.title.default');

  const errorsForSummary = (): Record<string, string[]> => {
    if (shouldShowTopLevelError(tabName, hasError)) {
      const pageName =
        tabName === PAGES_NAMES.ESSENTIALS
          ? t('errorSummary.costs')
          : t('errorSummary.income');

      const inputId =
        tabName === PAGES_NAMES.ESSENTIALS
          ? 'formmortgageRepayment'
          : 'formstatePension';

      return {
        [inputId]: [t('errorSummary.text', { pageName })],
      };
    }

    const out: Record<string, string[]> = {};

    for (const [key, arr] of Object.entries(errorDetails ?? {})) {
      const msgs = (arr ?? [])
        .filter((x): x is string => x !== undefined)
        .map((msg) => t(`aboutYou.errors.${msg}`));

      if (msgs.length) out[key] = msgs;
    }

    return out;
  };

  // Usage:
  const summary = errorsForSummary();

  return (
    <>
      <H1 className="py-8 text-blue-700" data-testid="title">
        {title}
      </H1>
      {description && (
        <Paragraph className="md:max-w-[90%] md:mb-8 mb-6 text-base">
          {description}
        </Paragraph>
      )}
      <div className="md:max-w-[60%]" ref={errorSummaryRef} tabIndex={-1}>
        {hasError && (
          <ErrorSummary
            errors={summary}
            titleLevel="h2"
            title={errorTitle}
            classNames="mt-6 md:mt-8 mb-6"
          />
        )}
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <SummaryContextProvider>
          <div className="basis-8/12">{children}</div>
          <VisibleSection visible={makeSummaryTotalVisible}>
            <RealTimeSummary summaryData={summaryData} />
          </VisibleSection>
        </SummaryContextProvider>
      </div>
    </>
  );
};

export default TabContent;
