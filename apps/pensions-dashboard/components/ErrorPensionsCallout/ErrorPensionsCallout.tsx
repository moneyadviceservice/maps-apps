import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const ErrorPensionsCallout = ({ count }: { count: number }) => {
  const { t } = useTranslation();
  if (count === 0) return null;

  const errorTitle =
    count === 1
      ? t('pages.your-pension-search-results.error.title-single')
      : t('pages.your-pension-search-results.error.title', {
          number: `${count}`,
        });

  const errorText =
    count === 1
      ? t('pages.your-pension-search-results.error.text-single')
      : t('pages.your-pension-search-results.error.text', {
          number: `${count}`,
        });

  return (
    <div data-testid="error-pensions-callout" className="mb-6 md:mb-10">
      <Heading
        data-testid="error-title"
        level="h3"
        component="h2"
        color="text-blue-700"
        className="mb-6 font-semibold"
      >
        {errorTitle}
      </Heading>
      <Paragraph testId="error-text">{errorText}</Paragraph>
    </div>
  );
};
