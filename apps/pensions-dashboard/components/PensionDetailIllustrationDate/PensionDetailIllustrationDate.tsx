import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangement } from '../../lib/types';
import { formatDate, getMostRecentBenefitIllustration } from '../../lib/utils';

export const PensionDetailIllustrationDate = ({
  data,
}: {
  data: PensionArrangement;
}) => {
  const { t } = useTranslation();
  const mostRecentIllustration = getMostRecentBenefitIllustration(
    data.benefitIllustrations,
  );
  return (
    <Paragraph className="mb-0">
      <span className="max-sm:block">
        {t('pages.pension-details.details.last-updated')}:{' '}
      </span>
      {mostRecentIllustration
        ? formatDate(mostRecentIllustration.illustrationDate)
        : t('common.no-data')}{' '}
      <Markdown
        disableParagraphs
        className="ml-1"
        content={t('tooltips.illustration-date')}
      />
    </Paragraph>
  );
};
