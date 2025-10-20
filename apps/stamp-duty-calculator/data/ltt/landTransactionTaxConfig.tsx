import numeral from 'numeral';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  CalculatorConfig,
  PropertyTaxCalculatorInput,
  PropertyTaxCalculatorResult,
} from '../../components/BaseCalculator';
import { LinkList } from '../../components/LinkList';
import { TaxExplainer } from '../../components/TaxExplainer/TaxExplainer';
import type { BuyerType as WalesBuyerType } from '../rates/LTTRates';
import { createStampDutyFields } from '../sharedFields';
import { HaveYouTried } from 'components/HaveYouTried';
import { calculateLandTransactionTax } from '../../utils/calculations';
import { validateStampDutyFormWithFieldErrors } from '../../utils/validation';

export type LandTransactionTaxInput = PropertyTaxCalculatorInput;
export type LandTransactionTaxResult = PropertyTaxCalculatorResult;

type TranslationFunction = (options: { en: any; cy: any }, params?: any) => any;

export const landTransactionTaxConfig: CalculatorConfig<
  LandTransactionTaxInput,
  LandTransactionTaxResult
> = {
  name: 'LTT Calculator',
  title: 'Land Transaction Tax Calculator',
  analyticsToolName: 'LTT Calculator',
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
              Calculate the Land Transaction Tax on your residential property in
              Wales
            </ToolIntro>
            <div className="hidden sm:block">
              <Paragraph>
                Our calculator lets you know the amount of{' '}
                <Link
                  href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-everything-you-need-to-know"
                  target={isEmbedded ? '_blank' : ''}
                >
                  Land Transaction Tax
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
              Cyfrifwch y Dreth Trafodiadau Tir ar eich eiddo preswyl yng
              Nghymru
            </ToolIntro>
            <div className="hidden sm:block">
              <Paragraph>
                Mae ein cyfrifiannell yn gadael i chi wybod faint o{' '}
                <Link
                  href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-everything-you-need-to-know"
                  target={isEmbedded ? '_blank' : ''}
                >
                  Dreth trafodiadau tir
                </Link>{' '}
                y byddwch yn agored i&apos;w dalu. Bydd yn gweithio allan faint
                fydd arnoch i&apos;w dalu, p&apos;un a ydych chi&apos;n{' '}
                <Link
                  href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/first-time-buyer-money-tips"
                  target={isEmbedded ? '_blank' : ''}
                >
                  brynwr tro cyntaf
                </Link>
                , yn symud tŷ, neu&apos;n prynu eiddo ychwanegol.
              </Paragraph>
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
        value: 'firstOrNextHome',
        text: z({
          en: 'my first or next home',
          cy: 'Fy nghartref cyntaf neu nesaf',
        }),
      },
      {
        value: 'additionalHome',
        text: z({
          en: 'my additional property or second home',
          cy: 'fy eiddo ychwanegol neu fy ail gartref',
        }),
      },
    ],
  },

  calculate: (input: LandTransactionTaxInput) => {
    const price = Number(input.price);
    if (!price || !input.buyerType || !input.purchaseDate) return null;
    return calculateLandTransactionTax(
      price * 100,
      input.buyerType as WalesBuyerType,
      input.purchaseDate,
    );
  },

  formatResult: (
    result: LandTransactionTaxResult,
    input: LandTransactionTaxInput,
    z: TranslationFunction,
  ) => (
    <>
      <Paragraph className="mb-4 text-5xl font-bold break-all t-result-tax">
        £{numeral(result.tax / 100).format('0,0.00')}
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

  resultTitle: (_input: LandTransactionTaxInput, z: TranslationFunction) => {
    return z({
      en: 'Land Transaction Tax to pay is',
      cy: "Treth Trafodiadau Tir i'w dalu yw",
    });
  },

  validateForm: (input: LandTransactionTaxInput, z: TranslationFunction) =>
    validateStampDutyFormWithFieldErrors(input, z),

  howIsItCalculated: (input: LandTransactionTaxInput, _isEmbedded: boolean) => (
    <TaxExplainer
      buyerType={input.buyerType as WalesBuyerType}
      purchaseDate={input.purchaseDate}
      taxType="LTT"
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
            en: (
              <>
                You must send an LTT return and pay the tax within 30 days of
                the day after completion (or other effective date of the
                transaction). If you have a solicitor, agent or conveyancer,
                they&apos;ll usually file your return and pay the tax on your
                behalf. If they don&apos;t do this for you, you can file a
                return and pay the tax yourself – contact the{' '}
                <Link
                  href="https://www.gov.wales/welsh-revenue-authority/contact-us"
                  target={isEmbedded ? '_blank' : ''}
                >
                  Welsh Revenue Authority
                </Link>{' '}
                for a paper return.
              </>
            ),
            cy: (
              <>
                Mae&apos;n rhaid i chi anfon ffurflen TTT a thalu&apos;r dreth
                cyn pen 30 diwrnod o&apos;r diwrnod ar ôl i chi gwblhau (neu
                ddyddiad effeithiol arall y trafodiad). Os oes gennych
                gyfreithiwr, asiant neu drawsgludwr, byddant fel arfer yn
                ffeilio&apos;ch ffurflen ac yn talu&apos;r dreth ar eich rhan.
                Os nad ydyn nhw&apos;n gwneud hyn ar eich rhan, gallwch ffeilio
                dychweliad a thalu&apos;r dreth eich hun – cysylltwch ag{' '}
                <Link
                  href="https://www.llyw.cymru/awdurdod-cyllid-cymru/cysylltwch-a-ni"
                  target={isEmbedded ? '_blank' : ''}
                >
                  Awdurdod Cyllid Cymru
                </Link>{' '}
                am dychweliad papur.
              </>
            ),
          })}
        </Paragraph>
      </div>
      <div>
        <Link
          href={z({
            en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-everything-you-need-to-know',
            cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-everything-you-need-to-know',
          })}
          target={isEmbedded ? '_blank' : ''}
        >
          {z({
            en: 'Land Transaction Tax – Everything you need to know',
            cy: 'Treth Trafodiadau Tir – Popeth y mae angen i chi ei wybod',
          })}
        </Link>
      </div>
    </UrgentCallout>
  ),

  findOutMore: (
    input: LandTransactionTaxInput,
    isEmbedded: boolean,
    z: TranslationFunction,
  ) => (
    <div className="lg:max-w-4xl">
      <LinkList
        title={z({ en: 'Find out more:', cy: 'Darganfyddwch fwy:' })}
        description={undefined}
        links={[
          {
            title: z({
              en: 'The cost of buying a house and moving',
              cy: 'Y gost o brynu tŷ a symud',
            }),
            href: z({
              en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
              cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/estimate-your-overall-buying-and-moving-costs',
            }),
          },
          {
            title: z({
              en: 'Mortgage-related fees and costs',
              cy: 'Ffioedd a chostau cysylltiedig â morgais',
            }),
            href: z({
              en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-related-fees-and-costs-at-a-glance',
              cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-related-fees-and-costs-at-a-glance',
            }),
          },
          {
            title: z({
              en: 'Homebuyer surveys and costs',
              cy: 'Arolygon a chostau prynwyr tai',
            }),
            href: z({
              en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
              cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/a-guide-to-homebuyer-surveys-and-costs',
            }),
          },
        ]}
        isEmbedded={isEmbedded}
      />
    </div>
  ),

  relatedLinks: (isEmbedded: boolean, z: TranslationFunction) => {
    const title = z({
      en: 'Buying in England, Northern Ireland or Scotland?',
      cy: "Prynu yn Lloegr, Gogledd Iwerddon neu'r Alban?",
    });

    const description = z({
      en: 'If you are buying a property in any of these countries, then use the appropriate calculator to work out how much you will pay',
      cy: "Os ydych chi'n prynu yn unrhyw un o'r gwledydd hyn, yna defnyddiwch y gyfrifiannell briodol i gyfrifo faint fyddwch chi'n ei dalu:",
    });

    const links = [
      {
        title: z({
          en: 'Calculate Stamp Duty in England or Northern Ireland',
          cy: 'Cyfrifwch Dreth Stamp yng Nghymru, Lloegr neu Ogledd Iwerddon',
        }),
        href: z({
          en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
          cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator',
        }),
      },
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
    ];

    return (
      <LinkList
        title={title}
        description={description}
        links={links}
        isEmbedded={isEmbedded}
      />
    );
  },

  haveYouTried: (
    isEmbedded: boolean,
    z: ReturnType<typeof useTranslation>['z'],
  ) => <HaveYouTried isEmbedded={isEmbedded} z={z} />,

  pagePath: (z: TranslationFunction) =>
    z({
      en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales',
      cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales',
    }),
};
