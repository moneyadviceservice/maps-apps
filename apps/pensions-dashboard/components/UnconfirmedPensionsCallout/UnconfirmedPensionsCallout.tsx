import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type UnconfirmedPensionsCalloutProps = {
  count: number;
};

export const UnconfirmedPensionsCallout = ({
  count,
}: UnconfirmedPensionsCalloutProps) => {
  const { t, locale } = useTranslation();

  if (count < 1) {
    return null;
  }

  const description =
    count === 1
      ? 'components.unconfirmed-pensions-callout.description-single'
      : 'components.unconfirmed-pensions-callout.description';

  return (
    <Callout variant={CalloutVariant.NEGATIVE} className="p-8 pt-6 mt-4">
      <div className="flex items-center mb-4">
        <Heading level="h4">
          {t('components.unconfirmed-pensions-callout.heading')}
        </Heading>
      </div>
      <div>
        <Markdown
          className="mb-4 md:mb-0"
          content={t(description, {
            number: count.toString(),
          })}
        />
        <Link
          href={`/${locale}/pensions-that-need-action`}
          data-testid="need-action-link"
        >
          {t('pages.your-pension-search-results.channels.unconfirmed.cta')}
        </Link>
      </div>
    </Callout>
  );
};
