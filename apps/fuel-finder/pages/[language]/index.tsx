import { type MouseEvent, useEffect, useState } from 'react';

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
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { TextInput } from '@maps-react/form/components/TextInput';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';
import { EmbedPageLayout } from '@maps-react/layouts/EmbedPageLayout';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
import { getServerSideAppConfig } from '@maps-react/netlify-functions/utils/getAppConfig';
import { parseEmergencyBanner } from '@maps-react/utils/parseEmergencyBanner';

import {
  analyticsPageTitle as getAnalyticsPageTitle,
  fuelTypeOptions,
  pageTitle as getPageTitle,
} from '../../data/fuel-finder';
import { readFuelType } from '../../utils/FuelFinder/filters/pageFilters';
import type { FuelType } from '../../utils/FuelFinder/types';

interface LandingPageProps {
  isEmbed: boolean;
  locationError: 'empty' | 'invalid' | null;
  location: string;
  fuelType: FuelType;
  emergencyBannerContent?: { en: string; cy: string } | null;
}

const FuelFinderLandingPage = ({
  isEmbed,
  locationError,
  location,
  fuelType,
  emergencyBannerContent,
}: LandingPageProps) => {
  const { z, locale } = useTranslation();
  const { addEvent } = useAnalytics();
  const router = useRouter();

  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const title = getPageTitle(z);
  const analyticsPageTitle = getAnalyticsPageTitle(z);

  useEffect(() => {
    addEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'petrol-price-finder',
        pageTitle: analyticsPageTitle,
        lang: locale,
        categoryLevels: ['Everyday money'],
        site: 'moneyhelper',
        pageType: 'tool page',
        source: isEmbed ? 'embedded' : 'direct',
      },
      tool: {
        toolName: 'Petrol price finder',
        toolCategory: '',
        toolStep: '1',
        stepName: 'Petrol price finder Landing',
      },
    });
  });

  const handleGeolocation = (event: MouseEvent<HTMLButtonElement>) => {
    // The button sits inside the form, so read the checked fuel radio the
    // same way a submit would
    const selectedFuelType = String(
      new FormData(event.currentTarget.form ?? undefined).get('fuelType') ??
        fuelType,
    );
    setGeoError('');
    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const params = new URLSearchParams({
          lat: latitude.toString(),
          lng: longitude.toString(),
          fuelType: selectedFuelType,
        });
        if (isEmbed) params.set('isEmbedded', 'true');
        router.push(`/${locale}/results?${params.toString()}`);
      },
      () => {
        setGeoLoading(false);
        setGeoError(
          z({
            en: 'Unable to determine your location. Please enter a city, town, or postcode instead.',
            cy: 'Methu cadarnhau eich lleoliad. Rhowch ddinas, tref neu god post yn lle.',
          }),
        );
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
    );
  };

  const summaryErrors: Record<string, string[]> = {};
  if (locationError) {
    summaryErrors.location = [
      locationError === 'empty'
        ? z({
            en: 'Enter a city, town, or postcode',
            cy: 'Rhowch ddinas, tref neu god post.',
          })
        : z({
            en: 'We could not find that location. Please check and try again.',
            cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
          }),
    ];
  }
  if (geoError) {
    summaryErrors.location = [geoError];
  }

  const children = (
    <GridContainer>
      <div className="col-span-12 lg:col-span-10 xl:col-span-8">
        {!isEmbed && (
          <div className="mb-8">
            <BackLink
              href={`https://www.moneyhelper.org.uk/${locale}/everyday-money/budgeting/petrol-price-finder`}
            >
              {z({ en: 'Back', cy: 'Yn \u00f4l' })}
            </BackLink>
          </div>
        )}

        {(locationError || geoError) && (
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

        <Heading level="h1" color="text-blue-700" className="pb-8">
          {z({
            en: 'Find the cheapest fuel near you',
            cy: "Dod o hyd i'r petrol rhataf ger eich lle chi",
          })}
        </Heading>

        {isEmbed && (
          <Callout
            variant={CalloutVariant.WHITE}
            className="mb-8 text-lg md:text-2xl before:h-full before:bg-teal-300"
          >
            {z({
              en: 'Compare prices across the UK, updated every hour from the government Fuel Finder service.',
              cy: "Cymharwch brisiau ledled y DU, wedi'u diweddaru bob awr gan wasanaeth Canfod Tanwydd y llywodraeth.",
            })}
          </Callout>
        )}

        <form method="post" action="/api/submit-location">
          <input type="hidden" name="language" value={locale} />
          {isEmbed && <input type="hidden" name="isEmbed" value="true" />}

          <fieldset className="mb-8" aria-describedby="fuelType-hint">
            <legend>
              <Heading level="h2" color="text-gray-800" className="mb-4">
                {z({
                  en: 'What type of fuel do you need?',
                  cy: 'Pa fath o danwydd sydd ei angen arnoch?',
                })}
              </Heading>
            </legend>

            <Paragraph id="fuelType-hint" className="mb-6 text-lg">
              {z({
                en: 'This helps us show the right fuel for your vehicle.',
                cy: 'Mae hyn yn ein helpu i ddangos y tanwydd cywir ar gyfer eich cerbyd.',
              })}
            </Paragraph>

            <div className="space-y-4">
              {fuelTypeOptions(z).map((option) => (
                <RadioButton
                  key={option.value}
                  id={`fuelType-${option.value}`}
                  name="fuelType"
                  value={option.value}
                  defaultChecked={fuelType === option.value}
                >
                  {option.title}
                </RadioButton>
              ))}
            </div>
          </fieldset>

          <div className="pb-4">
            <Heading level="h2" color="text-gray-800" className="mb-4">
              {z({
                en: 'What is your location?',
                cy: 'Beth yw eich lleoliad?',
              })}
            </Heading>

            <Paragraph className="text-lg">
              {z({
                en: 'Your location helps us find the cheapest petrol stations near you right now.',
                cy: "Mae eich lleoliad yn ein helpu i ddod o hyd i'r gorsafoedd petrol rhataf sy'n agos atoch chi ar hyn o bryd.",
              })}
            </Paragraph>
          </div>

          <div className="md:inline-flex md:flex-col">
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block pb-1 text-2xl font-medium text-gray-800"
              >
                {z({
                  en: 'City, town, or postcode',
                  cy: 'Dinas, tref, neu god post',
                })}
              </label>
              <TextInput
                id="location"
                name="location"
                type="text"
                hasGlassBoxClass={true}
                defaultValue={location}
                hint={z({
                  en: 'For example, London or SW1A 2AA',
                  cy: 'Er enghraifft, Llundain neu SW1A 2AA',
                })}
                error={
                  locationError === 'empty'
                    ? z({
                        en: 'Enter a city, town, or postcode',
                        cy: 'Rhowch ddinas, tref neu god post.',
                      })
                    : locationError === 'invalid'
                    ? z({
                        en: 'We could not find that location. Please check and try again.',
                        cy: 'Nid oeddem yn gallu dod o hyd i’r lleoliad hynny. Gwiriwch a rhowch gynnig arall.',
                      })
                    : undefined
                }
              />
            </div>

            <noscript>
              <style>{`.js-only { display: none !important; }`}</style>
            </noscript>
            <div className="mb-10 js-only md:mb-16">
              <Paragraph className="mb-3 text-lg text-center md:text-left">
                {z({ en: 'or', cy: 'neu' })}
              </Paragraph>
              <Button
                variant={geoLoading ? 'loading' : 'secondary'}
                type="button"
                className="justify-center w-full"
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
              className="justify-center w-full"
              analyticsClassName="tool-nav-submit tool-nav-complete"
            >
              {z({
                en: 'Find cheapest prices near you',
                cy: "Dod o hyd i'r prisiau rhataf yn agos atoch chi",
              })}
            </Button>
          </div>
        </form>
      </div>
    </GridContainer>
  );

  return isEmbed ? (
    <EmbedPageLayout title={title}>{children}</EmbedPageLayout>
  ) : (
    <ToolPageLayout
      title={title}
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
  const locationError = (query.locationError as string) || null;
  const location = (
    (Array.isArray(query.location) ? query.location[0] : query.location) ?? ''
  ).trim();
  const fuelType = readFuelType(query);

  return {
    props: {
      isEmbed,
      locationError,
      location,
      fuelType,
      emergencyBannerContent,
    } as LandingPageProps,
  };
};

export default FuelFinderLandingPage;
