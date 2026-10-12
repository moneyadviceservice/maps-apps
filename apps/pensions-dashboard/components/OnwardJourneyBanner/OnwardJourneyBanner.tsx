import { twMerge } from 'tailwind-merge';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

type OnwardJourneyBannerProps = {
  className?: string;
};

export const OnwardJourneyBanner = ({
  className,
}: OnwardJourneyBannerProps) => {
  const { t } = useTranslation();

  return (
    <section
      data-testid="onward-journey-banner"
      className={twMerge('space-y-5 md:space-y-6', className)}
      aria-labelledby="onward-journey-heading"
    >
      <Heading
        id="onward-journey-heading"
        data-testid="onward-journey-banner-heading"
        level="h2"
        variant="primary"
        className="scroll-mt-28 md:scroll-mt-32"
        tabIndex={-1}
      >
        {t('pages.your-pension-breakdown.onward-journey.heading')}
      </Heading>
      <Paragraph
        variant="primary"
        testId="onward-journey-banner-body"
        className="mb-0 text-lg md:text-2xl"
      >
        {t('pages.your-pension-breakdown.onward-journey.body')}
      </Paragraph>
      <Link
        data-testid="onward-journey-banner-cta"
        asButtonVariant="secondary"
        href={t('pages.your-pension-breakdown.onward-journey.cta-href')}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center lg:col-start-1 lg:row-start-3 lg:inline-flex lg:w-fit lg:text-left"
      >
        {t('pages.your-pension-breakdown.onward-journey.cta')}
      </Link>
    </section>
  );
};
