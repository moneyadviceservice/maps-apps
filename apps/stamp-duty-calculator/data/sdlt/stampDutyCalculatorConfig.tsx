import numeral from 'numeral';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { LinkList } from '../../components/LinkList';
import {
  CalculatorConfig,
  PropertyTaxCalculatorInput,
  PropertyTaxCalculatorResult,
} from '../../components/BaseCalculator';
import type { BuyerType as StandardBuyerType } from '../rates/SDLTRates';
import { FindOutMore } from './FindOutMore';
import { TaxExplainer } from '../../components/TaxExplainer/TaxExplainer';

import { calculateStampDuty } from '../../utils/calculations';
import useTranslation from '@maps-react/hooks/useTranslation';
import { HaveYouTried } from 'components/HaveYouTried';
import { validateStampDutyFormWithFieldErrors } from '../../utils/validation';
import { createStampDutyFields } from '../sharedFields';

export type StampDutyInput = PropertyTaxCalculatorInput;
export type StampDutyResult = PropertyTaxCalculatorResult;

type TranslationFunction = (options: { en: any; cy: any }, params?: any) => any;

export const stampDutyCalculatorConfig: CalculatorConfig<
  StampDutyInput,
  StampDutyResult
> = {
  name: 'SDLT Calculator',
  title: 'Stamp Duty Land Tax Calculator',
  analyticsToolName: 'SDLT Calculator',
  analyticsSteps: {
    calculate: 'Calculate',
    results: 'Results',
  },
  socialShareTitle: {
    en: 'Stamp Duty calculator - See how much tax you’ll pay',
    cy: 'Cyfrifiannell Treth Stamp – Gweler faint y byddwch yn ei thalu',
  },

  introduction: (isEmbedded: boolean, z: TranslationFunction) => (
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
  ),

  fields: createStampDutyFields,

  fieldOptions: {
    buyerType: (z: TranslationFunction) => [
      {
        value: 'firstTimeBuyer',
        text: z({ en: 'my first home', cy: 'fy nghartref cyntaf' }),
      },
      {
        value: 'nextHome',
        text: z({ en: 'my next home', cy: 'fy nghartref nesaf' }),
      },
      {
        value: 'additionalHome',
        text: z({
          en: 'my additional property or second home',
          cy: 'eiddo ychwanegol neu ail gartref',
        }),
      },
    ],
  },

  calculate: (input: StampDutyInput) => {
    const price = Number(input.price);
    if (!price || !input.buyerType || !input.purchaseDate) return null;
    return calculateStampDuty(
      price * 100,
      input.buyerType as StandardBuyerType,
      input.purchaseDate,
    );
  },

  formatResult: (
    result: StampDutyResult,
    input: StampDutyInput,
    z: TranslationFunction,
  ) => (
    <>
      <Paragraph
        data-testid="tax-result"
        className="mb-4 text-5xl font-bold text-gray-700 break-all t-result-tax"
      >
        £{numeral(result.tax / 100).format('0,00')}
      </Paragraph>
      <Paragraph className="mb-6 text-xl text-gray-700">
        {z(
          {
            en: 'Based on purchase date of {purchaseDate}',
            cy: 'Yn seiliedig ar ddyddiad prynu {purchaseDate}',
          },
          {
            purchaseDate: result.purchaseDate.replace(/-/g, '/'),
          },
        )}
      </Paragraph>
      <Paragraph className="text-xl text-gray-700 t-result-rate">
        {z(
          {
            en: 'Effective tax rate is {tax}',
            cy: 'Y raddfa dreth effeithiol yw {tax}',
          },
          { tax: `${result.percentage.toFixed(2)}%` },
        )}
      </Paragraph>
    </>
  ),

  resultTitle: (input: StampDutyInput, z: TranslationFunction) => {
    const titles: Record<string, string> = {
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
    return titles[input.buyerType] ?? '';
  },

  validateForm: (input: StampDutyInput, z: TranslationFunction) =>
    validateStampDutyFormWithFieldErrors(input, z),

  howIsItCalculated: (input: StampDutyInput, _isEmbedded: boolean) => (
    <TaxExplainer
      buyerType={input.buyerType as StandardBuyerType}
      purchaseDate={input.purchaseDate}
      taxType="SDLT"
    />
  ),

  didYouKnow: (isEmbedded: boolean, z: TranslationFunction) => (
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
  ),

  findOutMore: (input: StampDutyInput, isEmbedded: boolean) => (
    <FindOutMore
      buyerType={input.buyerType as StandardBuyerType}
      isEmbedded={isEmbedded}
    />
  ),

  relatedLinks: (isEmbedded: boolean, z: TranslationFunction) => {
    const title = z({
      en: 'Buying in Scotland or Wales?',
      cy: 'Prynu yn yr Alban neu Cymru?',
    });
    const description = z({
      en: 'The Scottish and Welsh equivalents of the Stamp Duty Land Tax (SDLT) paid in England and Northern Ireland is the Land and Buildings Transaction Tax (LBTT) in Scotland the Land Transaction Tax (LTT) in Wales.',
      cy: "Yng Nghymru a'r Alban, yr hyn sy'n cyfateb i Dreth Dir y Dreth Stamp (SDLT) a delir yn Lloegr a Gogledd Iwerddon, yw'r Dreth Trafodion Tir yng Nghymru (LTT) a'r Dreth Trafodion Tir ac Adeiladau (LBTT) yn yr Alban.",
    });

    return (
      <LinkList
        title={title}
        description={description}
        isEmbedded={isEmbedded}
        links={[
          {
            title: z({
              en: 'Calculate Land and Buildings Transaction Tax for Scotland',
              cy: 'Cyfrifwch Dreth Trafodiadau Tir ac Adeiladau ar gyfer yr Alban',
            }),
            href: z({
              en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
              cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
            }),
          },
          {
            title: z({
              en: 'Calculate Land Transaction Tax for Wales',
              cy: 'Cyfrifwch Dreth Trafodiadau Tir ar gyfer Cymru',
            }),
            href: z({
              en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales',
              cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales',
            }),
          },
        ]}
      />
    );
  },

  haveYouTried: (
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => <HaveYouTried isEmbedded={isEmbedded} z={z} />,

  pagePath: (z: TranslationFunction) =>
    z({
      en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
      cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator',
    }),
};
