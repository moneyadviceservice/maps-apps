import { ChangeEvent, KeyboardEvent, useEffect, useRef } from 'react';

import numeral from 'numeral';
import { calculateStampDuty } from 'utils/StampDutyCalculator/calculateStampDuty';

import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2, H3 } from '@maps-react/common/components/Heading';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer/TeaserCardContainer';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { Select } from '@maps-react/form/components/Select';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import useTranslation from '@maps-react/hooks/useTranslation';

import { FindOutMore } from '../../data/FindOutMore';
import { HowIsItCalculated } from '../../data/HowIsCalculated';
import { LinksToOtherCalculators } from '../../data/LinksToOtherCalculators';
import bubbles from '../../public/teaser-card-images/bubbles.jpg';
import child from '../../public/teaser-card-images/child.jpg';

interface EventInfo {
  toolName: string;
  toolStep: number;
  stepName: string;
  errorDetails?: Array<{
    reactCompType: string;
    reactCompName: string;
    errorMessage: string;
  }>;
  reactCompType?: string;
  reactCompName?: string;
}

const Intro = ({ isEmbedded }: { isEmbedded: boolean }) => {
  const { z } = useTranslation();

  return (
    <>
      {z({
        en: (
          <>
            <ToolIntro>
              Calculate the Stamp Duty you will owe if you&apos;re purchasing a
              residential property in England or Northern Ireland
            </ToolIntro>
            <div className="hidden sm:block">
              <Paragraph>
                Our calculator lets you know the amount of{' '}
                <Link
                  href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/everything-you-need-to-know-about-stamp-duty"
                  target={isEmbedded ? '_blank' : ''}
                >
                  Stamp Duty
                </Link>{' '}
                you&apos;ll be liable to pay. It&apos;ll work out how much
                you&apos;ll owe, whether you&apos;re a{' '}
                <Link
                  href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/first-time-buyer-money-tips"
                  target={isEmbedded ? '_blank' : ''}
                >
                  first-time buyer
                </Link>
                , moving home, or buying an additional property.
              </Paragraph>
            </div>
          </>
        ),
        cy: (
          <>
            <ToolIntro>
              Cyfrifwch y Dreth Stamp fydd yn ddyledus gennych os ydych yn prynu
              eiddo preswyl yn Lloegr neu Ogledd Iwerddon
            </ToolIntro>

            <div className="hidden sm:block">
              Mae ein cyfrifiannell yn rhoi gwybod am y swm o{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/everything-you-need-to-know-about-stamp-duty"
                target={isEmbedded ? '_blank' : ''}
              >
                Dreth Stamp
              </Link>{' '}
              bydd angen i chi ei dalu. Bydd yn cyfrifo faint bydd yn ddyledus
              {''}
              gennych, os ydych yn{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/first-time-buyer-money-tips"
                target={isEmbedded ? '_blank' : ''}
              >
                brynwr tro cyntaf
              </Link>{' '}
              , symud cartref, neu&apos;n prynu eiddo ychwanegol.
            </div>
          </>
        ),
      })}
    </>
  );
};

const InstructionAndResult = ({
  result,
  buyerType,
  calculated,
  anyErrors,
  analyticsData,
  addEvent,
  completionTrackingStarted,
}: {
  result: any;
  buyerType: string;
  calculated: boolean;
  anyErrors: boolean;
  analyticsData: AnalyticsData;
  addEvent: (data: Record<string, unknown>) => void;
  completionTrackingStarted: boolean;
}) => {
  const { z } = useTranslation();

  if (
    !completionTrackingStarted &&
    calculated &&
    !anyErrors &&
    typeof window !== 'undefined'
  ) {
    addEvent({
      ...analyticsData,
      event: 'toolCompletion',
    });
  }

  return (
    <div className="p-3 lg:p-8">
      {result ? (
        <div className="t-result">
          <H3 className="mb-4 text-xl">{getBuyerTypeTitle(buyerType, z)}</H3>
          <Paragraph
            data-testid="tax-result"
            className="mb-4 text-5xl font-bold text-gray-700 break-all t-result-tax"
          >
            £{numeral(result.tax / 100).format('0,00')}
          </Paragraph>
          <Paragraph className="text-xl text-gray-700 t-result-rate">
            {z(
              {
                en: 'The effective tax rate is {tax}',
                cy: 'Y gyfradd dreth effeithiol yw {tax}',
              },
              { tax: `${result.percentage.toFixed(2)}%` },
            )}
          </Paragraph>
        </div>
      ) : (
        <>
          <H3 className="mb-8 text-xl">
            {z({
              en: 'Calculate how much Stamp Duty you will pay:',
              cy: 'Cyfrifwch faint o dreth stamp byddwch yn eu talu:',
            })}
          </H3>
          <ol className="px-5 text-gray-800 list-decimal marker:text-blue-800 marker:font-bold">
            <li className="mb-3">
              {z({
                en: 'Select type of property you are buying',
                cy: "Dewiswch fath o eiddo rydych chi'n ei brynu",
              })}
            </li>
            <li className="mb-3">
              {z({
                en: 'Enter purchase price',
                cy: 'Rhowch y pris prynu',
              })}
            </li>
            <li className="mb-3">
              {z({
                en: 'Press "Calculate"',
                cy: 'Gwasgwch "Cyfrifo"',
              })}
            </li>
          </ol>
        </>
      )}
    </div>
  );
};

const DidYouKnow = ({ isEmbedded }: { isEmbedded: boolean }) => {
  const { z } = useTranslation();

  return (
    <UrgentCallout variant="arrow">
      <h3 className="text-lg font-bold text-gray-800">
        {z({ en: 'Did you know?', cy: 'A wyddech chi?' })}
      </h3>
      <div className="text-gray-800 text-md">
        <Paragraph>
          {z({
            en: "You have to pay Stamp Duty within 14 days of buying a property. If you're using a solicitor to carry out the conveyancing, they will normally organise the payment for you.",
            cy: "Rhaid i chi dalu Treth Stamp cyn pen 14 diwrnod ar ol prynu eiddo. Os ydych yn defnyddio cyfreithiwr i gwblhau'r trawsgludo, bydd fel arfer yn trefnu'r taliad ar eich rhan",
          })}
        </Paragraph>
      </div>
      <div>
        <Link
          href={z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/everything-you-need-to-know-about-stamp-duty',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/everything-you-need-to-know-about-stamp-duty',
          })}
          target={isEmbedded ? '_blank' : ''}
        >
          {z({
            en: 'Stamp Duty - Everything you need to know',
            cy: 'Treth Stamp - Popeth sydd angen i chi wybod',
          })}
        </Link>
      </div>
    </UrgentCallout>
  );
};

/**
 * Stamp Duty Calculator Component
 */

type Props = {
  propertyPrice: string;
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  calculated: boolean;
  title: string;
  analyticsData: AnalyticsData;
  isEmbedded: boolean;
};

let trackingStarted = false;
const completionTrackingStarted = false;

// Helper function to get buyer type title
const getBuyerTypeTitle = (buyerType: string, z: any) => {
  const titles = {
    firstTimeBuyer: z({
      en: 'Stamp duty on your first home is',
      cy: 'Treth stamp ar eich cartref cyntaf yw:',
    }),
    nextHome: z({
      en: 'Stamp duty on your next home is',
      cy: 'Treth Stamp ar eich cartref nesaf yw',
    }),
    additionalHome: z({
      en: 'Stamp duty on your additional property is',
      cy: 'Treth Stamp ar eich eiddo ychwanegol neu ail gartref yw',
    }),
  };
  return titles[buyerType as keyof typeof titles] ?? '';
};

// Helper function to create validation errors
const createValidationErrors = (
  calculated: boolean,
  buyerType: string,
  price: number,
  z: any,
) => ({
  buyerType:
    calculated && !buyerType
      ? [
          z({
            en: 'Select the type of property you are buying',
            cy: "Dewiswch y math o eiddo rydych chi'n ei brynu",
          }),
        ]
      : [],
  price:
    calculated && !price
      ? [
          z({
            en: 'Enter a property price, for example £200,000',
            cy: 'Rhowch bris eiddo, er enghraifft £200,000',
          }),
        ]
      : [],
});

// Helper function to check if any errors exist
const hasValidationErrors = (errors: Record<string, string[]>) =>
  Object.values(errors).some((errorArray) => errorArray.length > 0);

export const StampDutyCalculator = ({
  propertyPrice,
  buyerType,
  calculated,
  title,
  analyticsData,
  isEmbedded,
}: Props) => {
  const { z } = useTranslation();
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  const errorSummaryRef = useRef<{
    focus: () => void;
    scrollIntoView: () => void;
  } | null>(null);

  type FieldName = 'I am Buying' | 'Property price';

  const trackingFieldNames: Record<FieldName, boolean> = {
    'I am Buying': false,
    'Property price': false,
  };

  const createAnalyticsData = (
    reactCompType: string,
    reactCompName: FieldName,
  ) => ({
    event: 'toolInteraction',
    eventInfo: {
      toolName: 'SDLT Calculator',
      toolStep: calculated ? 2 : 1,
      stepName: calculated ? 'Results' : 'Calculate',
      reactCompType,
      reactCompName,
    },
  });

  const handleToolInteractionEvent = (
    event:
      | KeyboardEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>,
    reactCompType: string,
    reactCompName: FieldName,
  ) => {
    if (event.type === 'keydown') {
      const keyEvent = event as React.KeyboardEvent<HTMLInputElement>;
      const key = keyEvent.key;

      // check that the value entered is numerical before executing trackevent
      if (!/\d/.test(key)) {
        return;
      }
    }

    if (!trackingFieldNames[reactCompName]) {
      addEvent(createAnalyticsData(reactCompType, reactCompName));
      trackingFieldNames[reactCompName] = true;
    }
  };

  const calculate = calculateStampDuty;

  const price = Number(propertyPrice);
  const result = price && buyerType && calculate(price * 100, buyerType);
  const showResults = calculated && buyerType;

  const selectOptions = [
    {
      text: z({ en: 'my first home', cy: 'fy nghartref cyntaf' }),
      value: 'firstTimeBuyer',
    },
    {
      text: z({ en: 'my next home', cy: 'fy nghartref nesaf' }),
      value: 'nextHome',
    },
    {
      text: z({
        en: 'my additional property or second home',
        cy: 'eiddo ychwanegol neu ail gartref',
      }),
      value: 'additionalHome',
    },
  ];

  const errors = createValidationErrors(calculated, buyerType, price, z);
  const anyErrors = hasValidationErrors(errors);

  useEffect(() => {
    if (anyErrors) {
      const eventInfo: EventInfo = {
        toolName: 'SDLT Calculator',
        toolStep: calculated && !anyErrors ? 2 : 1,
        stepName: calculated && !anyErrors ? 'Results' : 'Calculate',
        errorDetails: [
          ...errors.price.map((error) => ({
            reactCompType: 'MoneyInput',
            reactCompName: 'Property price',
            errorMessage: error,
          })),
          ...errors.buyerType.map((error) => ({
            reactCompType: 'Select',
            reactCompName: 'I am Buying',
            errorMessage: error,
          })),
        ],
      };

      addEvent({
        event: 'errorMessage',
        eventInfo,
      });
    }
  }, [anyErrors]);
  const { addEvent } = useAnalytics();

  const fireToolStartEvent = () => {
    if (!trackingStarted) {
      addEvent({
        ...analyticsData,
        event: calculated ? 'toolRestart' : 'toolStart',
      });
      trackingStarted = true;
    }
  };

  useEffect(() => {
    const infoElement = document.getElementById('info-element');

    if (infoElement) {
      if (calculated && !anyErrors) {
        infoElement.focus();
        infoElement.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (calculated && anyErrors && errorSummaryRef.current) {
      errorSummaryRef.current.focus();
      errorSummaryRef.current.scrollIntoView();
    }
  }, [calculated, anyErrors]);

  return (
    <div ref={scrollToRef} className="space-y-9">
      <Container>
        <div className="mx-auto space-y-4 text-gray-800 lg:max-w-4xl">
          {anyErrors && (
            <ErrorSummary
              ref={errorSummaryRef}
              title={z({ en: 'This is a problem', cy: 'Mae yna broblem' })}
              errors={errors}
            />
          )}
          <Intro isEmbedded={isEmbedded} />
        </div>
      </Container>

      <hr className="border-slate-400" />

      <Container>
        <form
          id="sdlt"
          method="get"
          className="mx-auto lg:max-w-4xl"
          onSubmit={() => {
            if (calculated) {
              const recalculated: HTMLInputElement | null =
                document.getElementById('recalculated') as HTMLInputElement;
              recalculated.value = 'true';
            }
          }}
        >
          <input
            type="hidden"
            name="isEmbedded"
            value={isEmbedded ? 'true' : 'false'}
          />
          <div className={`flex flex-row-reverse flex-wrap lg:flex-nowrap`}>
            <div className={`w-full mb-8 lg:w-1/2`}>
              <div
                className={`${
                  showResults ? 'mb-0 md-8 sm:mb-[0px]' : ''
                } lg:ml-8`}
              >
                <InformationCallout>
                  <div id="info-element" tabIndex={-1}>
                    <InstructionAndResult
                      result={result}
                      buyerType={buyerType}
                      calculated={calculated}
                      anyErrors={anyErrors}
                      analyticsData={analyticsData}
                      addEvent={addEvent}
                      completionTrackingStarted={completionTrackingStarted}
                    />
                  </div>
                </InformationCallout>
              </div>
            </div>
            <div className={`w-full ${calculated ? '' : 'mb-8'} lg:w-1/2`}>
              {showResults && (
                <div className="mb-8 lg:hidden">
                  <div className="mx-auto lg:max-w-4xl">
                    <ExpandableSection
                      title={z({
                        en: 'How is it calculated?',
                        cy: "Sut mae'n cael ei gyfrifo?",
                      })}
                    >
                      <div className="px-8 pt-8 pb-6 bg-gray-100">
                        <div className="space-y-4">
                          <HowIsItCalculated buyerType={buyerType} />
                        </div>
                      </div>
                    </ExpandableSection>
                  </div>
                </div>
              )}
              <input type="hidden" name="calculated" value="true" />
              <input
                type="hidden"
                id="recalculated"
                name="recalculated"
                value="false"
              />
              <fieldset>
                <legend className="sr-only">
                  {z({
                    en: title + ' ' + 'form',
                    cy: 'Ffurflen' + ' ' + title,
                  })}
                </legend>
                <div className="space-y-9">
                  <div>
                    {z({
                      en: "You'll need to select and input both elements of this form to get a result.",
                      cy: "Bydd angen i chi ddewis a mewnbynnu'r ddwy elfen o'r ffurflen hon i gael canlyniad.",
                    })}
                  </div>

                  <div className="mb-3 t-i-am-buying" id="buyerTypeId">
                    <Errors errors={errors.buyerType}>
                      <label
                        htmlFor="buyerType"
                        className="inline-block mb-2 text-gray-800"
                      >
                        {z({ en: 'I am buying', cy: "Rwy'n prynu" })}
                      </label>
                      {errors.buyerType.map((e) => (
                        <div key={e} id={'buyerTypeError'}>
                          <span className="sr-only">Error: </span>
                          <div className="block mb-2 text-red-700">{e}</div>
                        </div>
                      ))}
                      <Select
                        id="buyerType"
                        name="buyerType"
                        hidePlaceholder={true}
                        defaultValue={buyerType}
                        options={selectOptions}
                        aria-describedby={
                          errors.buyerType.length > 0 ? 'buyerTypeError' : ''
                        }
                        onChange={(e) => {
                          fireToolStartEvent();
                          handleToolInteractionEvent(
                            e,
                            'Select',
                            'I am Buying',
                          );
                        }}
                      />
                    </Errors>
                  </div>
                  <div className="mb-8 t-property-price" id="priceId">
                    <Errors errors={errors.price}>
                      <label
                        htmlFor="price"
                        className="inline-block mb-2 text-gray-800"
                      >
                        {z({ en: 'Property price', cy: 'Pris Eiddo' })}
                      </label>
                      {errors.price.map((e) => (
                        <div key={e} id={'priceIdError'}>
                          <span className="sr-only">Error:</span>
                          <div className="block mb-2 text-red-700">{e}</div>
                        </div>
                      ))}
                      <MoneyInput
                        id="price"
                        name="price"
                        defaultValue={price || ''}
                        aria-describedby={
                          errors.price.length > 0 ? 'priceIdError' : ''
                        }
                        onChange={(e) => {
                          fireToolStartEvent();
                          handleToolInteractionEvent(
                            e,
                            'MoneyInput',
                            'Property price',
                          );
                        }}
                        onKeyDown={(e) => {
                          handleToolInteractionEvent(
                            e,
                            'MoneyInput',
                            'Property price',
                          );
                        }}
                      />
                    </Errors>
                  </div>
                  <Button
                    analyticsClassName="tool-nav-submit tool-nav-complete"
                    className={
                      calculated ? 'sdlt-recalculate' : 'sdlt-calculate'
                    }
                  >
                    {calculated
                      ? z({ en: 'Recalculate', cy: 'Ailgyfrifwch' })
                      : z({ en: 'Calculate', cy: 'Cyfrifwch' })}
                  </Button>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </Container>

      {showResults && (
        <div className="hidden lg:block">
          <Container>
            <div className="mx-auto lg:max-w-4xl">
              <ExpandableSection
                title={z({
                  en: 'How is it calculated?',
                  cy: "Sut mae'n cael ei gyfrifo?",
                })}
              >
                <div className="px-8 pt-8 pb-6 bg-gray-100">
                  <div className="space-y-4">
                    <HowIsItCalculated buyerType={buyerType} />
                  </div>
                </div>
              </ExpandableSection>
            </div>
          </Container>
        </div>
      )}
      {showResults && (
        <Container>
          <div className="mx-auto lg:max-w-4xl">
            <DidYouKnow isEmbedded={isEmbedded} />
          </div>
        </Container>
      )}

      {showResults && (
        <Container>
          <FindOutMore buyerType={buyerType} isEmbedded={isEmbedded} />
        </Container>
      )}

      <hr className="border-slate-400" />

      {(!calculated || (calculated && !buyerType)) && (
        <Container>
          <LinksToOtherCalculators isEmbedded={isEmbedded} />
        </Container>
      )}

      {showResults && (
        <Container className={`${isEmbedded && 'pb-5'}`}>
          <TeaserCardContainer gridCols={3}>
            <div className="space-y-4 t-have-you-tried">
              <H2 color="text-blue-800">
                {z({ en: 'Have you tried?', cy: 'Rhowch gynnig ar?' })}
              </H2>
              <Paragraph>
                {z({
                  en: 'We have other tools that can help you understand and prepare for purchasing a property.',
                  cy: 'Mae gennym declynnau eraill a all eich helpu i ddeall a pharatoi ar gyfer prynu eiddo.',
                })}
              </Paragraph>
            </div>
            <TeaserCard
              title={z({
                en: 'Mortgage calculator',
                cy: 'Cyfrifiannell morgais',
              })}
              href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator"
              image={bubbles}
              description={z({
                en: "Calculate how much you'd pay each month on a mortgage",
                cy: 'Cyfrifwch faint byddwch yn ei dalu pob mis ar forgais',
              })}
              hrefTarget={isEmbedded ? '_blank' : undefined}
            />
            <TeaserCard
              title={z({
                en: 'Mortgage affordability calculator',
                cy: 'Cyfrifiannell fforddiadwyedd morgais',
              })}
              href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-affordability-calculator"
              image={child}
              description={z({
                en: 'Estimate how much you can afford to borrow to buy a home',
                cy: 'Amcangyfrifwch faint allwch fforddio benthyg i brynu cartref',
              })}
              hrefTarget={isEmbedded ? '_blank' : undefined}
            />
          </TeaserCardContainer>
          <ToolFeedback />
        </Container>
      )}
    </div>
  );
};
