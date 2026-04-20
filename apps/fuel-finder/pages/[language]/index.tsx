import { useEffect, useState } from 'react';

import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import LocationPin from 'assets/images/location-pin.svg';

import Spinner from '@maps-react/common/assets/images/spinner.svg';
import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { EmergencyBanner } from '@maps-react/core/components/EmergencyBanner';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { PhaseType } from '@maps-react/core/components/PhaseBanner';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

interface LandingPageProps {
  isEmbed: boolean;
  postcodeError: 'empty' | 'invalid' | null;
  postcode: string;
  emergencyBannerContent?: { en: string; cy: string } | null;
}

const FuelFinderLandingPage = ({
  isEmbed,
  postcodeError,
  postcode,
  emergencyBannerContent,
}: LandingPageProps) => {
  const { z, locale } = useTranslation();
  const { addEvent } = useAnalytics();
  const router = useRouter();

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const title = z({ en: 'Find cheap fuel', cy: 'Dod o hyd i danwydd rhad' });

  const analyticsPageTitle = z({
    en: `${title} - MoneyHelper Tools`,
    cy: `${title} - Teclynnau HelpwrArian`,
  });

  useEffect(() => {
    addEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'fuel-finder',
        pageTitle: analyticsPageTitle,
        lang: locale,
        categoryLevels: ['Everyday money'],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: isEmbed ? 'embedded' : 'direct',
      },
      tool: {
        toolName: 'Fuel Finder',
        toolCategory: '',
        toolStep: '1',
        stepName: 'Fuel Finder Landing',
      },
    });
  });

  const handleGeolocation = () => {
    setGeoError('');
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const params = new URLSearchParams({
          lat: latitude.toString(),
          lng: longitude.toString(),
        });
        if (isEmbed) params.set('isEmbedded', 'true');
        router.push(`/${locale}/results?${params.toString()}`);
      },
      () => {
        setGeoLoading(false);
        setGeoError(
          z({
            en: 'Unable to determine your location. Please enter a postcode instead.',
            cy: 'Methu pennu eich lleoliad. Rhowch god post yn lle hynny.',
          }),
        );
      },
    );
  };

  const summaryErrors: Record<string, string[]> = {};
  if (postcodeError) {
    summaryErrors.postcode = [
      postcodeError === 'empty'
        ? z({ en: 'Enter a postcode', cy: 'Rhowch god post' })
        : z({
            en: 'We could not find that postcode. Please check and try again.',
            cy: "Ni allem ddod o hyd i'r cod post hwnnw. Gwiriwch a cheisiwch eto.",
          }),
    ];
  }
  if (geoError) {
    summaryErrors.geolocation = [geoError];
  }

  const children = (
    <GridContainer>
      <div className="col-span-12 lg:col-span-10 xl:col-span-8">
        {!isEmbed && (
          <div className="mb-8">
            <BackLink
              href={`https://www.moneyhelper.org.uk/${locale}/everyday-money`}
            >
              {z({ en: 'Back', cy: 'Yn \u00f4l' })}
            </BackLink>
          </div>
        )}

        {(postcodeError || geoError) && (
          <div className="mb-8">
            <ErrorSummary
              title={z({
                en: 'There is a problem',
                cy: 'Mae yna broblem',
              })}
              errors={summaryErrors}
            />
          </div>
        )}

        <Callout
          variant={CalloutVariant.WHITE}
          className="mb-8 before:bg-teal-300"
        >
          <Paragraph className="mb-0 text-xl">
            {z({
              en: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              cy: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            })}
          </Paragraph>
        </Callout>

        <div className="pb-4">
          <Heading level="h1" color="text-gray-800" className="mb-4">
            {z({
              en: 'What is your location?',
              cy: 'Beth yw eich lleoliad?',
            })}
          </Heading>

          <Paragraph className="text-lg">
            {z({
              en: 'Your location helps us find the cheapest petrol stations near you right now.',
              cy: "Mae eich lleoliad yn ein helpu i ddod o hyd i'r gorsafoedd petrol rhataf yn agos atoch chi ar hyn o bryd.",
            })}
          </Paragraph>
        </div>

        <form method="post" action="/api/submit-postcode">
          <input type="hidden" name="language" value={locale} />
          {isEmbed && <input type="hidden" name="isEmbed" value="true" />}

          <div className="mb-4 w-full md:max-w-sm">
            <label
              htmlFor="postcode"
              className="block pb-1 text-2xl font-medium text-gray-800"
            >
              {z({ en: 'Enter a postcode', cy: 'Rhowch god post' })}
            </label>
            <TextInput
              id="postcode"
              name="postcode"
              type="text"
              hasGlassBoxClass={true}
              defaultValue={postcode}
              hint={z({
                en: 'For example SW1A 2AA',
                cy: 'Er enghraifft SW1A 2AA',
              })}
              error={
                postcodeError === 'empty'
                  ? z({
                      en: 'Enter a postcode',
                      cy: 'Rhowch god post',
                    })
                  : postcodeError === 'invalid'
                  ? z({
                      en: 'We could not find that postcode. Please check and try again.',
                      cy: "Ni allem ddod o hyd i'r cod post hwnnw. Gwiriwch a cheisiwch eto.",
                    })
                  : undefined
              }
            />
          </div>

          <noscript>
            <style>{`.js-only { display: none !important; }`}</style>
          </noscript>
          <div className="js-only mb-10">
            <Paragraph className="mb-3 text-lg text-center md:max-w-sm">
              {z({ en: 'or', cy: 'neu' })}
            </Paragraph>
            <Button
              variant={geoLoading ? 'loading' : 'secondary'}
              type="button"
              className="w-full md:max-w-sm justify-center"
              iconLeft={
                geoLoading ? (
                  <Spinner className="animate-spin" />
                ) : (
                  <LocationPin />
                )
              }
              onClick={handleGeolocation}
              disabled={geoLoading}
            >
              {z({
                en: 'Current location',
                cy: 'Lleoliad presennol',
              })}
            </Button>
          </div>

          <Button
            variant="primary"
            type="submit"
            className="w-full md:w-auto justify-center"
            analyticsClassName="tool-nav-submit tool-nav-complete"
          >
            {z({
              en: 'Find cheapest prices near you',
              cy: "Dewch o hyd i'r prisiau rhataf yn agos atoch chi",
            })}
          </Button>
        </form>
      </div>
    </GridContainer>
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
      showContactUs={false}
      noMargin={true}
      titleTag="span"
      layout="grid"
      mainClassName="my-8"
      phase={PhaseType.BETA}
      phaseFeedbackLink={z({
        en: 'https://forms.office.com/Pages/ResponsePage.aspx?id=MhDku86PQk26tUTiFRCIbWGb15XS-wVNqpSc16_QSvhUN09UQUI4SVhITDhCV0RRSzcyMlIwUTI4Ny4u',
        cy: 'https://forms.office.com/Pages/ResponsePage.aspx?id=MhDku86PQk26tUTiFRCIbWGb15XS-wVNqpSc16_QSvhUN09UQUI4SVhITDhCV0RRSzcyMlIwUTI4Ny4u',
      })}
      phaseBannerClassName="text-sm text-black"
      topInfoSection={
        emergencyBannerContent && (
          <EmergencyBanner content={emergencyBannerContent} />
        )
      }
    >
      {children}
    </ToolPageLayout>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { query, req } = context;

  const appConfig = await getServerSideAppConfig(req);
  const emergencyBannerContent = parseEmergencyBanner(
    appConfig.getValue('emergency-banner'),
  );

  const isEmbed = query.isEmbedded === 'true';
  const postcodeError = (query.postcodeError as string) || null;
  const postcode = (
    (Array.isArray(query.postcode) ? query.postcode[0] : query.postcode) ?? ''
  ).trim();

  return {
    props: {
      isEmbed,
      postcodeError,
      postcode,
      emergencyBannerContent,
    } as LandingPageProps,
  };
};

export default FuelFinderLandingPage;
