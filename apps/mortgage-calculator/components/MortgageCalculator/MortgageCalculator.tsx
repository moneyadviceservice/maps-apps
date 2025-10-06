import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import ArrowUp from '@maps-react/common/assets/images/arrow-up.svg';
import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { Container } from '@maps-react/core/components/Container';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { PercentInput } from '@maps-react/form/components/PercentInput';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Select } from '@maps-react/form/components/Select';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { OtherTools } from './OtherTools';
import { RecommendedReading } from './RecommendedReading';
import { Results } from './Results';

type SectionProps = {
  title: ReactNode;
  children: ReactNode;
};

type BalanceBreakdown = {
  year: number;
  presentValue: number;
};

export type CalculationResult = {
  debt: number;
  monthlyPayment: number;
  changedPayment: number;
  totalAmount: number;
  capitalSplit: number;
  interestSplit: number;
  balanceBreakdown: BalanceBreakdown[];
};

export type MortgageCalculatorProps = {
  calculationType: string;
  price: string;
  deposit: string;
  termYears: string;
  rate: number;
  calculationResult: CalculationResult;
  analyticsData: AnalyticsData;
  isEmbedded?: boolean;
};

type FieldName =
  | 'Property price'
  | 'Deposit'
  | 'Interest rate'
  | 'Mortgage term';

let trackingStarted = false;

const trackingFieldNames: Record<number, Record<FieldName, boolean>> = {
  1: {
    'Property price': false,
    Deposit: false,
    'Interest rate': false,
    'Mortgage term': false,
  },
  2: {
    'Property price': false,
    Deposit: false,
    'Interest rate': false,
    'Mortgage term': false,
  },
};

const trackingRadioButtons: Record<number, boolean> = {
  1: false,
  2: false,
};

const Section = ({ children, title }: SectionProps) => {
  return (
    <div className="space-y-3">
      <div className="text-[28px] lg:text-[38px] font-bold">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export const MortgageCalculator = ({
  calculationType,
  price,
  deposit,
  termYears,
  rate,
  calculationResult,
  analyticsData,
  isEmbedded,
}: MortgageCalculatorProps) => {
  const { z } = useTranslation();
  const { addEvent } = useAnalytics();
  const router = useRouter();
  const { language } = router.query;
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [isMediaQueryMatches, setIsMediaQueryMatches] =
    useState<boolean>(false);
  const [clickedErrorMessage, setClickedErrorMessage] = useState(false);
  const [step, setStep] = useState(1);
  const createAnalyticsData = (
    reactCompType: string,
    reactCompName: string,
    step: number,
  ) => ({
    event: 'toolInteraction',
    eventInfo: {
      toolName: 'Mortgage Calculator',
      toolStep: step,
      stepName: step === 1 ? 'Calculate' : 'Results',
      reactCompType,
      reactCompName,
    },
  });

  const fireToolStartEvent = () => {
    if (!trackingStarted) {
      addEvent({
        ...analyticsData,
        event: calculationResult ? 'toolRestart' : 'toolStart',
      });
      trackingStarted = true;
    }
  };

  const handleToolInteractionEvent = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    reactCompType: string,
    reactCompName: FieldName,
    step: number,
  ) => {
    const value = event.target.value.trim();
    const sanitizedValue = value.replace(/\D/g, '');

    if (step in trackingFieldNames) {
      if (sanitizedValue !== '' && !trackingFieldNames[step][reactCompName]) {
        addEvent(createAnalyticsData(reactCompType, reactCompName, step));
        trackingFieldNames[step][reactCompName] = true;
      }
    }
  };

  const handleRadioInputEvent = (step: number) => {
    if (step in trackingRadioButtons) {
      if (!trackingRadioButtons[step]) {
        addEvent(createAnalyticsData('RadioButton', 'Type of mortgage', step));
        trackingRadioButtons[step] = true;
      }
    }
  };

  const term = Array.from({ length: 41 }, (_, i) => i).map((year) => {
    return { text: `${year} years`, value: String(year) };
  });

  const DescriptionText = {
    price: z({
      en: "If you're not buying a property, enter the amount left on your mortgage.",
      cy: 'Os nad ydych yn prynu eiddo, rhowch y swm sydd ar ôl ar eich morgais.',
    }),
    deposit: z({
      en: "If you're remortgaging, this does not apply.",
      cy: 'Os ydych yn ail-forgeisi, nid yw hyn yn berthnasol.',
    }),
    term: z({
      en: 'The average period for repayment of a mortgage is 25 years.',
      cy: 'Cyfnod ad-daliad morgais cyfartalog yw 25 blynedd.',
    }),
    rate: z({
      en: "We've defaulted to the current interest rate.",
      cy: 'Rydym wedi nodi cyfradd llog presennol yn ddiofyn',
    }),
  };

  type ErrorObject = {
    [key: string]: string[];
  };

  const errors: ErrorObject = {
    price:
      calculationResult && !price
        ? [
            z({
              en: 'Enter a property price, for example £200,000',
              cy: 'Rhowch bris eiddo, er enghraifft £200,000',
            }),
          ]
        : [],
    rate:
      calculationResult && isNaN(rate)
        ? [
            z({
              en: 'Enter an interest rate, for example 5%',
              cy: 'Rhowch gyfradd llog, er enghraifft 5%',
            }),
          ]
        : [],
  };

  const anyErrors = Object.keys(errors).some((key) => errors[key].length > 0);
  useEffect(() => {
    if (anyErrors) {
      const eventInfo: AnalyticsData = {
        eventInfo: {
          toolName: 'Mortgage Calculator',
          toolStep: step,
          stepName: step === 1 ? 'Calculate' : 'Results',
          errorDetails: [
            {
              reactCompType: 'MoneyInput',
              reactCompName: 'Property price',
              errorMessage: 'Enter a property price, for example £200,000',
            },
          ],
        },
      };

      addEvent({
        event: 'errorMessage',
        eventInfo,
      });
    }
  }, [anyErrors]);

  useEffect(() => {
    if (window) {
      setIsMediaQueryMatches(window.matchMedia('(max-width: 440px)').matches);
    }
  }, []);

  const handleCalculate = () => {
    if (anyErrors && errorRef.current) {
      errorRef.current.focus();
    }
    if (clickedErrorMessage) {
      setClickedErrorMessage(false);
    }
  };

  const handleErrorLinkClick = () => {
    const element = document.getElementById('price');
    if (element) {
      element.focus();
    }
  };

  useEffect(() => {
    if (price) {
      setStep(2);
    }
    if (step === 1 && anyErrors && errorRef.current && !clickedErrorMessage) {
      errorRef.current.focus();
    }
  }, [anyErrors, clickedErrorMessage, price]);

  return (
    <Container className="text-gray-800">
      <div ref={scrollToRef} className="max-w-[840px] space-y-6 pb-6">
        {!isEmbedded && (
          <div className="mt-6">
            <BackLink
              href={`https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/mortgage-calculator`}
            >
              {z({ en: 'Back', cy: 'Yn ôl' })}
            </BackLink>
          </div>
        )}
        <ErrorSummary
          title={z({ en: 'There is a problem', cy: 'Mae yna broblem' })}
          errors={errors}
          handleErrorClick={handleErrorLinkClick}
          ref={errorRef}
          containerClassNames="mx-auto space-y-4 text-gray-800 outline-none lg:max-w-4xl focus-visible:inset-0"
        />
        <H1 id="mortgage-calculator">
          {z({
            en: 'Calculate your monthly mortgage payment',
            cy: 'Cyfrifo eich taliad morgais misol',
          })}
        </H1>
      </div>
      {isMediaQueryMatches && (
        <div className="block md:hidden">
          <UrgentCallout
            className="pt-10 pb-8 mb-5 overflow-hidden"
            variant="arrow"
          >
            <p>
              {z({
                en: 'Remember to plan for other costs like mortgage fees, legal fees and Stamp Duty tax.',
                cy: 'Cofiwch i gynllunio ar gyfer costau eraill fel ffioedd morgais, ffioedd cyfreithiol a threth Stamp',
              })}
            </p>
          </UrgentCallout>
        </div>
      )}

      <div className="max-w-[840px] space-y-8">
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          <form
            className="px-6 pb-6 space-y-6 bg-gray-100 lg:pb-10 lg:px-8 lg:space-y-8 t-mortgage-calculator-form"
            id="mortgage-calculator-form"
            action="#results"
          >
            <input
              type="hidden"
              name="isEmbedded"
              value={isEmbedded ? 'true' : 'false'}
            />
            <fieldset>
              <legend className="sr-only">
                Calculate your monthly mortgage payment
              </legend>
              <div className="space-y-6 lg:space-y-8">
                <Section
                  title={z({ en: 'Type of mortgage', cy: 'Math o forgais' })}
                >
                  <div className="pt-4 space-y-2">
                    <RadioButton
                      id="repayment"
                      name={'calculationType'}
                      defaultChecked={
                        calculationType === 'repayment' || !calculationType
                      }
                      value={'repayment'}
                      onFocus={() => {
                        fireToolStartEvent();
                        handleRadioInputEvent(step);
                      }}
                    >
                      {z({
                        en: (
                          <>
                            <span className="font-bold">Repayment:</span> repay
                            capital and interest together.
                          </>
                        ),
                        cy: (
                          <>
                            <span className="font-bold">Ad-daliad:</span>{' '}
                            ad-dalu cyfalaf a llog gyda&apos;i gilydd
                          </>
                        ),
                      })}
                    </RadioButton>
                    <RadioButton
                      id="interest"
                      name={'calculationType'}
                      defaultChecked={calculationType === 'interestonly'}
                      value={'interestonly'}
                      onFocus={() => {
                        fireToolStartEvent();
                        handleRadioInputEvent(step);
                      }}
                    >
                      {z({
                        en: (
                          <>
                            <span className="font-bold">Interest-only:</span>{' '}
                            repay the interest. Capital paid off at end of term.
                          </>
                        ),
                        cy: (
                          <>
                            <span className="font-bold">Llog yn unig:</span>{' '}
                            ad-dalu&apos;r llog. Mae cyfalaf yn cael eu had-dalu
                            ar ddiwedd y tymor.
                          </>
                        ),
                      })}
                    </RadioButton>
                  </div>
                </Section>
                <span className="block border-b border-gray-400" />
                <Section
                  title={
                    <label htmlFor="price">
                      {z({ en: 'Property price ', cy: 'Pris eiddo' })}
                    </label>
                  }
                >
                  <>
                    <p>{DescriptionText.price}</p>
                    <Errors errors={errors.price}>
                      {errors.price.map((e) => (
                        <div key={e} id={'priceIdError'}>
                          <span className="sr-only">Error:</span>
                          <div className="block mb-2 text-red-600">{e}</div>
                        </div>
                      ))}
                      <MoneyInput
                        id="price"
                        name="price"
                        inputMode="numeric"
                        type="text"
                        defaultValue={price}
                        decimalSeparator="."
                        decimalScale={2}
                        isAllowed={({ floatValue }) =>
                          (floatValue ?? 0) >= 0 &&
                          (floatValue ?? 0) <= 999999999
                        }
                        aria-label={
                          z({
                            en: 'Property price in pounds',
                            cy: 'Pris eiddo mewn punnoedd',
                          }) +
                          '. ' +
                          DescriptionText.price
                        }
                        aria-describedby={
                          errors.price.length > 0 ? 'priceIdError' : ''
                        }
                        onChange={(e) => {
                          fireToolStartEvent();
                          handleToolInteractionEvent(
                            e,
                            'MoneyInput',
                            'Property price',
                            step,
                          );
                        }}
                      />
                    </Errors>
                  </>
                </Section>
                <span className="block border-b border-gray-400" />
                <Section
                  title={
                    <label htmlFor="deposit">
                      {z({ en: 'Deposit ', cy: 'Blaendal ' })}
                      <span className="text-xl font-normal">
                        {z({ en: '(Optional)', cy: '(Dewisol)' })}
                      </span>
                    </label>
                  }
                >
                  <>
                    <p>{DescriptionText.deposit}</p>
                    <MoneyInput
                      id="deposit"
                      name="deposit"
                      inputMode="numeric"
                      type="text"
                      defaultValue={deposit}
                      decimalScale={2}
                      isAllowed={({ floatValue }) =>
                        (floatValue ?? 0) >= 0 && (floatValue ?? 0) <= 999999999
                      }
                      aria-label={
                        z({
                          en: 'Deposit in pounds',
                          cy: 'Blaendal mewn punnoedd',
                        }) +
                        '. ' +
                        DescriptionText.deposit
                      }
                      onChange={(e) => {
                        fireToolStartEvent();
                        handleToolInteractionEvent(
                          e,
                          'MoneyInput',
                          'Deposit',
                          step,
                        );
                      }}
                    />
                  </>
                </Section>
                <span className="block border-b border-gray-400" />
                <Section
                  title={
                    <label htmlFor="termYears">
                      {z({ en: 'Mortgage term', cy: 'Tymor morgais' })}
                    </label>
                  }
                >
                  <>
                    <p>{DescriptionText.term}</p>
                    <Select
                      id="termYears"
                      name="termYears"
                      options={term.filter((option) => option.value !== '0')}
                      selectClassName="text-inherit"
                      defaultValue={
                        term[Number(termYears)]?.value || term[25]?.value
                      }
                      aria-description={DescriptionText.term}
                      onChange={(e) => {
                        fireToolStartEvent();
                        handleToolInteractionEvent(
                          e,
                          'Select',
                          'Mortgage term',
                          step,
                        );
                      }}
                    />
                  </>
                </Section>
                <span className="block border-b border-gray-400" />
                <Section
                  title={
                    <label htmlFor="rate">
                      {z({ en: 'Interest rate', cy: 'Cyfradd llog' })}
                    </label>
                  }
                >
                  <>
                    <p>{DescriptionText.rate}</p>
                    <Errors errors={errors.rate}>
                      {errors.rate.map((e) => (
                        <div key={e} id={'depositIdError'}>
                          <span className="sr-only">Error:</span>
                          <div className="block mb-2 text-red-700">{e}</div>
                        </div>
                      ))}
                      <PercentInput
                        id="rate"
                        name="rate"
                        inputMode="decimal"
                        type="text"
                        allowedDecimalSeparators={['.']}
                        decimalSeparator="."
                        allowNegative={false}
                        defaultValue={rate}
                        decimalScale={2}
                        isAllowed={({ floatValue }) =>
                          (floatValue ?? 0) <= 99.99
                        }
                        aria-label={
                          z({
                            en: 'Interest rate %',
                            cy: 'Cyfradd llog %',
                          }) +
                          '. ' +
                          DescriptionText.rate
                        }
                        aria-describedby={
                          errors.rate.length > 0 ? 'depositIdError' : ''
                        }
                        onChange={(e) => {
                          fireToolStartEvent();
                          handleToolInteractionEvent(
                            e,
                            'PercentInput',
                            'Interest rate',
                            step,
                          );
                        }}
                      />
                    </Errors>
                  </>
                </Section>
              </div>
            </fieldset>
            <Button
              className="w-full"
              data-testid="calculate-submit-button"
              type="submit"
              onClick={handleCalculate}
            >
              {calculationResult && !anyErrors
                ? z({ en: 'Recalculate', cy: 'Ailgyfrifo' })
                : z({ en: 'Calculate', cy: 'Cyfrifwch' })}
            </Button>
          </form>
          {calculationResult && !anyErrors ? (
            <div className={`md:${calculationResult ? 'block' : 'hidden'}`}>
              <Results
                calculationResult={calculationResult}
                analyticsData={analyticsData}
              />
            </div>
          ) : (
            !isMediaQueryMatches && (
              <div className="hidden md:block">
                <UrgentCallout className="mb-5 overflow-hidden" variant="arrow">
                  <p>
                    {z({
                      en: 'Remember to plan for other costs like mortgage fees, legal fees and Stamp Duty tax.',
                      cy: 'Cofiwch i gynllunio ar gyfer costau eraill fel ffioedd morgais, ffioedd cyfreithiol a threth Stamp',
                    })}
                  </p>
                </UrgentCallout>
              </div>
            )
          )}
        </div>
        {calculationResult && !anyErrors && (
          <>
            <div className="flex justify-end text-pink-800 text-right mt-[32px] md:hidden">
              <Link href="#mortgage-calculator-form">
                {z({ en: 'Recalculate', cy: 'Ailgyfrifo' })}
              </Link>
              <ArrowUp className="w-5 mt-1 ml-1" />
            </div>
            <RecommendedReading
              calculationType={calculationType}
              isEmbedded={isEmbedded}
            />
            <OtherTools isEmbedded={isEmbedded} />
            <ToolFeedback />
          </>
        )}
      </div>
    </Container>
  );
};
