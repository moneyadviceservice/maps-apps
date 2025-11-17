import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { Tabs } from '../../components/Tabs';
import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { getRetirementDate } from '../../lib/utils/data';

type PensionDetailHeaderProps = {
  data: PensionArrangement;
};
export const PensionDetailHeader = ({ data }: PensionDetailHeaderProps) => {
  const { t } = useTranslation();
  const retirementDate = getRetirementDate(data);

  return (
    <>
      <Paragraph
        testId="reference-number"
        className="mt-4 mb-0 md:mb-1 md:mt-9"
      >
        <strong className="block mr-2 sm:inline">
          {t('pages.pension-details.header.plan-reference')}:
        </strong>{' '}
        {data.contactReference ?? t('common.no-data')}
      </Paragraph>
      <Paragraph testId="retirement-date">
        <span className="block mr-2 sm:inline">
          <strong>{t('pages.pension-details.header.retirement-date')}</strong>{' '}
          <Markdown disableParagraphs content={t('tooltips.retirement-date')} />{' '}
          <strong>:</strong>
        </span>{' '}
        {retirementDate === NO_DATA ? t('common.no-data') : retirementDate}
      </Paragraph>
      <Tabs />
    </>
  );
};
