import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const ResultsHeading = () => {
  const { t } = useTranslation();

  return <Paragraph>{t('results.description')}</Paragraph>;
};
