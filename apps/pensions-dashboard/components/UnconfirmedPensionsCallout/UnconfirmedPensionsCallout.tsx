import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { PensionArrangement } from '../../lib/types';

type UnconfirmedPensionsCalloutProps = {
  data: PensionArrangement[];
};

export const UnconfirmedPensionsCallout = ({
  data,
}: UnconfirmedPensionsCalloutProps) => {
  const { t, locale } = useTranslation();
  if (data.length < 1) {
    return null;
  }
  return (
    <Callout variant={CalloutVariant.NEGATIVE} className="p-8 pt-6 mt-10">
      <div className="flex items-center mb-4">
        <Icon
          type={IconType.WARNING_SQUARE}
          className="text-red-700 h-[30px] w-[30px] hidden md:block"
        />

        <Heading level="h4" className="md:ml-4">
          {t('components.unconfirmed-pensions-callout.heading')}
        </Heading>
      </div>
      <div className="md:ml-12">
        <Markdown
          className="mb-4 md:mb-0"
          content={t('components.unconfirmed-pensions-callout.description', {
            number: data.length.toString(),
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
