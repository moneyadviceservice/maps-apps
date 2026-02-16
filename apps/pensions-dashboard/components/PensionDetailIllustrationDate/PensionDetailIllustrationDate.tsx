import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { PensionArrangement } from '../../lib/types';
import { formatDate } from '../../lib/utils/ui';

export const PensionDetailIllustrationDate = ({
  data,
}: {
  data: PensionArrangement;
}) => {
  const { t } = useTranslation();
  const illustrationDate = data.detailData?.illustrationDate;
  const lastUpdated = illustrationDate ? formatDate(illustrationDate) : NO_DATA;

  return (
    <Paragraph className="mb-0">
      <span className="max-sm:block">
        {t('pages.pension-details.details.last-updated')}:{' '}
      </span>
      {lastUpdated === NO_DATA ? t('common.unavailable') : lastUpdated}{' '}
      <Markdown
        disableParagraphs
        className="ml-1"
        content={t('tooltips.illustration-date')}
      />
    </Paragraph>
  );
};
