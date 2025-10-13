import numeral from 'numeral';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { LinkList } from '../../components/LinkList';
import { CalculatorConfig } from '../../components/BaseCalculator';
import { FindOutMore } from './FindOutMore';
import { HowIsItCalculated } from './HowIsCalculated';

import { calculateStampDuty } from '../../utils/calculateStampDuty';
import useTranslation from '@maps-react/hooks/useTranslation';
import { HaveYouTried } from 'data/HaveYouTried';

export interface StampDutyInput {
  buyerType: 'firstTimeBuyer' | 'nextHome' | 'additionalHome';
  price: string;
}

export interface StampDutyResult {
  tax: number;
  percentage: number;
}

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

  fields: (z: TranslationFunction) => [
    {
      name: 'buyerType',
      label: z({ en: 'I am buying', cy: 'Rwy’n prynu' }),
      type: 'select',
      required: true,
    },
    {
      name: 'price',
      label: z({ en: 'Property price', cy: 'Pris Eiddo' }),
      type: 'money',
      required: true,
    },
  ],

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
    if (!price || !input.buyerType) return null;
    return calculateStampDuty(price * 100, input.buyerType);
  },

  formatResult: (
    result: StampDutyResult,
    _input: StampDutyInput,
    z: TranslationFunction,
  ) => (
    <>
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
    </>
  ),

  resultTitle: (input: StampDutyInput, z: TranslationFunction) => {
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
    return titles[input.buyerType] ?? '';
  },

  validateForm: (input: StampDutyInput, z: TranslationFunction) => {
    const errors: Record<string, string[]> = {};

    if (!input.buyerType) {
      errors.buyerType = [
        z({
          en: 'Select the type of property you are buying',
          cy: "Dewiswch y math o eiddo rydych chi'n ei brynu",
        }),
      ];
    }

    if (!Number(input.price)) {
      errors.price = [
        z({
          en: 'Enter a property price, for example £200,000',
          cy: 'Rhowch bris eiddo, er enghraifft £200,000',
        }),
      ];
    }

    return errors;
  },

  howIsItCalculated: (input: StampDutyInput, _isEmbedded: boolean) => (
    <HowIsItCalculated buyerType={input.buyerType} />
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
    <FindOutMore buyerType={input.buyerType} isEmbedded={isEmbedded} />
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
