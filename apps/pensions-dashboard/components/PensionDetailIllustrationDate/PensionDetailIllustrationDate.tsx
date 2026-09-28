import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { NO_DATA } from '../../lib/constants';
import { formatDate, tooltipScreenReaderText } from '../../lib/utils/ui';

export const PensionDetailIllustrationDate = ({
  date,
}: {
  date: string | undefined;
}) => {
  const { t, locale } = useTranslation();
  const illustrationDate = date;
  const lastUpdated = illustrationDate
    ? formatDate(illustrationDate, locale)
    : NO_DATA;

  return (
    <Paragraph className="mt-3 mb-0 lg:px-2" data-testid="illustration-date">
      <span className="max-sm:block">
        {t('pages.pension-details.details.last-updated')}
        <Markdown
          disableParagraphs
          className="mx-1"
          content={t('tooltips.illustration-date')}
          tooltipProps={{
            accessibilityLabelOpen: tooltipScreenReaderText(
              t('tooltips.sr-text.calculation-date'),
              t,
            ),
          }}
        />
        :{' '}
      </span>
      {lastUpdated === NO_DATA ? t('common.unavailable') : lastUpdated}{' '}
    </Paragraph>
  );
};
