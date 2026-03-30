import { Heading, Icon, IconType } from '@maps-digital/shared/ui';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

export const ErrorPensionsCallout = ({ count }: { count: number }) => {
  const { t } = useTranslation();
  if (count === 0) return null;

  const errorTitle =
    count === 1
      ? t('pages.your-pension-search-results.channels.error.title-single')
      : t('pages.your-pension-search-results.channels.error.title', {
          number: `${count}`,
        });

  const errorText =
    count === 1
      ? t('pages.your-pension-search-results.channels.error.text-single')
      : t('pages.your-pension-search-results.channels.error.text', {
          number: `${count}`,
        });

  return (
    <div
      data-testid="error-pensions-callout"
      className="px-8 mb-6 border-gray-300 py-7 xl:py-9 xl:px-10 border-1 md:mb-10 rounded-bl-3xl"
    >
      <Heading
        component="h4"
        level="h4"
        variant="secondary"
        className="flex gap-4 mb-3 md:text-3xl"
      >
        <Icon
          type={IconType.WARNING_SQUARE}
          className="w-[30px] h-[30px] fill-red-700 relative top-[6px]"
        />
        <Markdown disableParagraphs testId="error-title" content={errorTitle} />
      </Heading>
      <Markdown
        testId="error-text"
        content={errorText}
        className="max-xl:mb-0"
      />
    </div>
  );
};
