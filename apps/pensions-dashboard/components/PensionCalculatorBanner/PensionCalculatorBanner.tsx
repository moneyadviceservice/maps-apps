import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type PensionCalculatorBannerProps = {
  className?: string;
};

export const PensionCalculatorBanner = ({
  className,
}: PensionCalculatorBannerProps) => {
  const { t } = useTranslation();

  return (
    <div
      data-testid="pension-calculator-banner"
      className={twMerge(
        'border-1 border-slate-400 rounded-bl-[36px] py-8 px-7 xl:p-8',
        className ?? '',
      )}
    >
      <Heading
        color="text-blue-700"
        className="flex items-start gap-2 font-semibold xl:items-center"
        level="h3"
        data-testid="pension-calculator-banner-heading"
      >
        <Icon
          type={IconType.CALCULATOR}
          className="-ml-2 max-md:-mt-1 text-magenta-500 shrink-0"
        />
        {t('components.pension-calculator-banner.heading')}
      </Heading>

      <Paragraph
        className="mt-4 text-lg mb-7 lg:text-2xl lg:mt-6"
        data-testid="pension-calculator-banner-body"
      >
        {t('components.pension-calculator-banner.body')}
      </Paragraph>

      <Link
        data-testid="pension-calculator-banner-cta"
        asButtonVariant="secondary"
        href={t('components.pension-calculator-banner.cta-href')}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start w-full leading-7 text-center sm:items-center sm:inline-flex sm:w-fit sm:text-left [&_svg]:shrink-0"
      >
        {t('components.pension-calculator-banner.cta')}
      </Link>

      <Paragraph
        className="flex items-center gap-2 mt-8 mb-0 font-bold lg:mt-6"
        data-testid="pension-calculator-banner-time"
      >
        <Icon type={IconType.CLOCK} className="w-[24px] h-[24px]" />
        {t('components.pension-calculator-banner.time')}
      </Paragraph>
    </div>
  );
};
