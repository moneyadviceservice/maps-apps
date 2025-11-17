import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { getMostRecentBenefitIllustration } from '../../lib/utils/data';
import { formatDate } from '../../lib/utils/ui';

export const PensionDetailIllustrationDate = ({
  data,
}: {
  data: PensionArrangement;
}) => {
  const { t } = useTranslation();
  const mostRecentIllustration = getMostRecentBenefitIllustration(
    data.benefitIllustrations,
  );
  const lastUpdated =
    mostRecentIllustration &&
    formatDate(mostRecentIllustration.illustrationDate);

  return (
    <Paragraph className="mb-0">
      <span className="max-sm:block">
        {t('pages.pension-details.details.last-updated')}:{' '}
      </span>
      {!lastUpdated || lastUpdated === NO_DATA
        ? t('common.no-data')
        : lastUpdated}{' '}
      <Markdown
        disableParagraphs
        className="ml-1"
        content={t('tooltips.illustration-date')}
      />
    </Paragraph>
  );
};
