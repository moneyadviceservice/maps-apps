import { ReactNode } from 'react';

import { RealTimeSummary } from 'components/RealTimeSummary';
import { VisibleSection } from 'components/VisibleSection';
import { SummaryContextProvider } from 'context/SummaryContextProvider/SummaryContextProvider';
import { PAGES_NAMES } from 'lib/constants/pageConstants';
import { SummaryType } from 'lib/types/summary.type';

import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  children: ReactNode;
  title: string;
  tabName: PAGES_NAMES;
  hasError: boolean;
  summaryData?: SummaryType;
  description?: ReactNode;
  errorDetails?: Record<string, (string | undefined)[]> | null;
};
type ErrorMap = Record<string, (string | undefined)[]>;

const TabContent = ({
  children,
  title,
  tabName,
  summaryData,
  description,
  hasError,
  errorDetails,
}: Props) => {
  const { t } = useTranslation();
  const makeSummaryTotalVisible =
    tabName !== PAGES_NAMES.ABOUTYOU && tabName !== PAGES_NAMES.SUMMARY;

  const shouldShowTopLevelError = (
    tabName: string,
    hasError: boolean,
  ): boolean => tabName !== PAGES_NAMES.ABOUTYOU && hasError;

  const buildErrorSummary = (
    errorDetails: Record<string, (string | undefined)[]>,
  ): ErrorMap => {
    const errorMap: ErrorMap = {};
    for (const [key, values] of Object.entries(errorDetails)) {
      errorMap[key] = values.map((value) =>
        value ? t(`aboutYou.errors.${value}`) : '',
      );
    }
    return errorMap;
  };

  const getErrorsForSummary = (opts: {
    tabName: string;
    hasError: boolean;
    errorDetails: Record<string, (string | undefined)[]> | null | undefined;
    t: (key: string) => string;
  }): ErrorMap | null | undefined => {
    const { tabName, hasError, errorDetails, t } = opts;

    if (shouldShowTopLevelError(tabName, hasError)) {
      return { value: [t('errorSummary.text')] };
    }
    if (!errorDetails) return null;
    return buildErrorSummary(errorDetails);
  };

  const errorsForSummary = getErrorsForSummary({
    tabName,
    hasError,
    errorDetails,
    t,
  });

  return (
    <>
      {hasError && (
        <div className="md:max-w-[60%] ">
          <ErrorSummary
            errors={errorsForSummary}
            titleLevel="h2"
            title={t('errorSummary.title')}
            classNames="mt-6 md:mt-8"
          />
        </div>
      )}

      <H1 className="py-8 text-blue-700" data-testid="title">
        {title}
      </H1>
      {description && (
        <Paragraph className="md:max-w-[60%] md:mb-8 mb-6">
          {description}
        </Paragraph>
      )}

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
