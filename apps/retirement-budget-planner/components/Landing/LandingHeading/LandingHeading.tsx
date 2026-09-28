import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

export const LandingHeading = ({
  nextPageLink,
  isEmbedded = false,
}: {
  nextPageLink: string;
  isEmbedded?: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <section data-testid="landing-heading">
      {/* Main page heading */}
      {!isEmbedded && (
        <Heading level="h1" variant="secondary">
          {t('landingPage.heading')}
        </Heading>
      )}

      {/* Subheading/intro */}
      <Heading
        level="h4"
        component="p"
        variant="secondary"
        fontWeight="font-normal"
        className="mt-4 text-balance"
      >
        {t('landingPage.intro')}
      </Heading>

      {/* Time estimate */}
      <Heading level="h6" component="p" className="mt-8">
        {t('landingPage.timeEstimate')}
      </Heading>

      {/* Start button */}
      <Link
        data-testid="rbp-link-from-heading"
        className="mt-6"
        asButtonVariant="primary"
        id="submit"
        href={nextPageLink}
      >
        {t('landingPage.startButton')}
      </Link>
    </section>
  );
};
