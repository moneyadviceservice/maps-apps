import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { formatDate } from '../../lib/utils/ui';

export const PensionDetailIllustrationDate = ({
  date,
}: {
  date: string | undefined;
}) => {
  const { t } = useTranslation();
  const illustrationDate = date;
  const lastUpdated = illustrationDate ? formatDate(illustrationDate) : NO_DATA;

  return (
    <Paragraph className="mt-2 mb-0 lg:px-2" data-testid="illustration-date">
      <span className="max-sm:block">
        {t('pages.pension-details.details.last-updated')}
        <Markdown
          disableParagraphs
          className="mx-1"
          content={t('tooltips.illustration-date')}
        />
        :{' '}
      </span>
      {lastUpdated === NO_DATA ? t('common.unavailable') : lastUpdated}{' '}
    </Paragraph>
  );
};
