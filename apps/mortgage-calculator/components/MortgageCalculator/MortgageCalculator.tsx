import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import ArrowUp from '@maps-react/common/assets/images/arrow-up.svg';
import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { Callout } from '@maps-react/common/components/Callout';
import { Errors } from '@maps-react/common/components/Errors';
import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { SocialShareTool } from '@maps-react/common/components/SocialShareTool';
import { ToolFeedback } from '@maps-react/common/components/ToolFeedback';
import { GridContainer } from '@maps-react/core/components/GridContainer';
import { ErrorSummary } from '@maps-react/form/components/ErrorSummary';
import { MoneyInput } from '@maps-react/form/components/MoneyInput';
import { PercentInput } from '@maps-react/form/components/PercentInput';
import { RadioButton } from '@maps-react/form/components/RadioButton';
import { Select } from '@maps-react/form/components/Select';
import { AnalyticsData, useAnalytics } from '@maps-react/hooks/useAnalytics';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Markdown } from '@maps-react/vendor/components/Markdown';

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
  const { t } = useTranslation();

  const { addEvent } = useAnalytics();
  const router = useRouter();
  const { language } = router.query;
  const scrollToRef = useRef<HTMLDivElement | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [isMediaQueryMatches, setIsMediaQueryMatches] =
    useState<boolean>(false);
  const [clickedErrorMessage, setClickedErrorMessage] = useState(false);
  const [step, setStep] = useState(1);

  const linkToLandingPage = `https://www.moneyhelper.org.uk/${language}/homes/buying-a-home/mortgage-repayment-calculator`;

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

  type ErrorObject = {
    [key: string]: string[];
  };

  const errors: ErrorObject = {
    price: calculationResult && !price ? [t('errorSummary.price')] : [],
    rate:
      calculationResult && Number.isNaN(rate) ? [t('errorSummary.rate')] : [],
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
    <GridContainer className="text-gray-800">
      <div
        ref={scrollToRef}
        className="col-span-12 lg:col-span-10 xl:col-span-8 space-y-6 pb-6"
      >
        {!isEmbedded && (
          <div className="mt-6">
            <BackLink href={linkToLandingPage}>{t('backLink')}</BackLink>
          </div>
        )}
        <ErrorSummary
          title={t('errorSummary.title')}
          errors={errors}
          handleErrorClick={handleErrorLinkClick}
          ref={errorRef}
          containerClassNames="mx-auto space-y-4 text-gray-800 outline-none focus-visible:inset-0"
        />
        <H1 id="mortgage-calculator">{t('title')}</H1>
        {isMediaQueryMatches && (
          <div className="block md:hidden">
            <Callout
              className="pt-10 pb-8 mb-5 overflow-hidden"
              variant="arrow"
            >
              <p>{t('callout')}</p>
            </Callout>
          </div>
        )}

        <div className="space-y-8">
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
                  <Section title={t('form.typeOfMortgage.label')}>
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
                        <Markdown
                          content={t('form.typeOfMortgage.option1')}
                          disableParagraphs
                        />
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
                        <Markdown
                          content={t('form.typeOfMortgage.option2')}
                          disableParagraphs
                        />
                      </RadioButton>
                    </div>
                  </Section>
                  <span className="block border-b border-gray-400" />
                  <Section
                    title={
                      <label htmlFor="price">
                        {t('form.propertyPrice.label')}
                      </label>
                    }
                  >
                    <>
                      <p>{t('form.propertyPrice.description')}</p>
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
                            t('form.propertyPrice.aria.label') +
                            '. ' +
                            t('form.propertyPrice.description')
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
                        {t('form.deposit.label')}
                        <span className="text-xl font-normal">
                          {t('form.optional')}
                        </span>
                      </label>
                    }
                  >
                    <>
                      <p>{t('form.deposit.description')}</p>
                      <MoneyInput
                        id="deposit"
                        name="deposit"
                        inputMode="numeric"
                        type="text"
                        defaultValue={deposit}
                        decimalScale={2}
                        isAllowed={({ floatValue }) =>
                          (floatValue ?? 0) >= 0 &&
                          (floatValue ?? 0) <= 999999999
                        }
                        aria-label={
                          t('form.deposit.aria.label') +
                          '. ' +
                          t('form.deposit.description')
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
                      <label htmlFor="termYears">{t('form.term.label')}</label>
                    }
                  >
                    <>
                      <p>{t('form.term.description')}</p>
                      <Select
                        id="termYears"
                        name="termYears"
                        options={term.filter((option) => option.value !== '0')}
                        selectClassName="text-inherit"
                        defaultValue={
                          term[Number(termYears)]?.value || term[25]?.value
                        }
                        aria-description={t('form.term.aria.description')}
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
                        {t('form.interestRate.label')}
                      </label>
                    }
                  >
                    <>
                      <p>{t('form.interestRate.description')}</p>
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
                            t('form.interestRate.aria.description') +
                            '. ' +
                            t('form.interestRate.description')
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
                  ? t('form.recalculate')
                  : t('form.calculate')}
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
                  <Callout className="mb-5 overflow-hidden" variant="arrow">
                    <p>{t('callout')}</p>
                  </Callout>
                </div>
              )
            )}
          </div>
          {calculationResult && !anyErrors && (
            <>
              <div className="flex justify-end text-pink-800 text-right mt-[32px] md:hidden">
                <Link href="#mortgage-calculator-form">
                  {t('form.recalculate')}
                </Link>
                <ArrowUp className="w-5 mt-1 ml-1" />
              </div>
              <RecommendedReading
                calculationType={calculationType}
                isEmbedded={isEmbedded}
              />
              <OtherTools isEmbedded={isEmbedded} />
              <ToolFeedback />
              <div className="flex flex-col justify-between py-6 mt-8 border-t print:hidden t-social-sharing sm:flex-row border-slate-400">
                <SocialShareTool
                  url={linkToLandingPage}
                  title={t('socialShareTool.title')}
                  subject={t('socialShareTool.subject')}
                  xTitle={t('socialShareTool.xTitle')}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </GridContainer>
  );
};
