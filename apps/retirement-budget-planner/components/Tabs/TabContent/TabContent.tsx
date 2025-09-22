import { ReactNode, useState } from 'react';

import { VisibleSection } from 'components/VisibleSection';
import { PAGES_NAMES } from 'lib/constants/pageConstants';

import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import useTranslation from '@maps-react/hooks/useTranslation';

type Props = {
  children: ReactNode;
  title: string;
  tabName: PAGES_NAMES;
  description?: ReactNode;
};

const TabContent = ({ children, title, tabName, description }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState<boolean>();
  const makeSummaryTotalVisible =
    tabName !== PAGES_NAMES.ABOUTYOU && tabName !== PAGES_NAMES.SUMMARY;
  return (
    <>
      {error && (
        <div className="md:max-w-[66%] ">
          <ErrorSummary
            errors={{ value: [t('errorSummary.text')] }}
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
        <Paragraph className="md:max-w-[80%] md:mb-8 mb-6">
          {description}
        </Paragraph>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="basis-8/12">{children}</div>
        <VisibleSection visible={makeSummaryTotalVisible}>
          <div data-testid="summary-total">Summary total component</div>
        </VisibleSection>
      </div>
    </>
  );
};

export default TabContent;
