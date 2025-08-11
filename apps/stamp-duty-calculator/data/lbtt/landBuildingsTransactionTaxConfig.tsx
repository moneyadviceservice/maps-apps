import numeral from 'numeral';
import { CalculatorConfig } from '../../components/BaseCalculator';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { UrgentCallout } from '@maps-react/common/components/UrgentCallout';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { Table } from '@maps-react/common/components/Table';
import { LinkList } from '../../components/LinkList';
import {
  calculateLandAndBuildingsTransactionTax,
  BuyerType,
} from '../../utils/calculateLandAndBuildingsTransactionTax';
import { HaveYouTried } from 'data/HaveYouTried';
import useTranslation from '@maps-react/hooks/useTranslation';

export interface LandTransactionTaxInput {
  buyerType: BuyerType;
  price: string;
}

export interface LandTransactionTaxResult {
  tax: number;
  percentage: number;
}

type TranslationFunction = (options: { en: any; cy: any }, params?: any) => any;

export const landBuildingsTransactionTaxConfig: CalculatorConfig<
  LandTransactionTaxInput,
  LandTransactionTaxResult
> = {
  name: 'LBTT Calculator',
  title: 'Land and Buildings Transaction Tax Calculator',
  analyticsToolName: 'LBTT Calculator',
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
              Calculate the Land and Buildings Transaction Tax on your
              residential property in Scotland
            </ToolIntro>
            <div className="hidden sm:block">
              Our calculator lets you know the amount of{' '}
              <Link
                href="https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-everything-you-need-to-know"
                target={isEmbedded ? '_blank' : ''}
              >
                Land and Buildings Transaction Tax
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
            </div>
          </>
        ),
        cy: (
          <>
            <ToolIntro>
              Cyfrifwch y Dreth Trafodion Tir ac Adeiladau ar eich eiddo preswyl
              yn yr Alban
            </ToolIntro>
            <div className="hidden sm:block">
              Mae ein cyfrifiannell yn rhoi gwybod am y swm o{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-everything-you-need-to-know"
                target={isEmbedded ? '_blank' : ''}
              >
                Dreth Trafodiadau Tir ac Adeiladau
              </Link>{' '}
              bydd angen i chi ei dalu. Bydd yn cyfrifo faint bydd yn ddyledus
              gennych, os ydych yn{' '}
              <Link
                href="https://www.moneyhelper.org.uk/cy/homes/buying-a-home/first-time-buyer-money-tips"
                target={isEmbedded ? '_blank' : ''}
              >
                brynwr tro cyntaf
              </Link>
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

  calculate: (input: LandTransactionTaxInput) => {
    const price = Number(input.price);
    if (!price || !input.buyerType) return null;
    return calculateLandAndBuildingsTransactionTax(
      price * 100,
      input.buyerType,
    );
  },

  formatResult: (
    result: LandTransactionTaxResult,
    _input: LandTransactionTaxInput,
    z: TranslationFunction,
  ) => (
    <>
      <Paragraph className="mb-4 text-5xl font-bold break-all t-result-tax">
        £{numeral(result.tax / 100).format('0,0.00')}
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

  resultTitle: (input: LandTransactionTaxInput, z: TranslationFunction) => {
    const { buyerType } = input;

    return (
      (buyerType === 'firstTimeBuyer' &&
        z({
          en: 'Land and Buildings Transaction Tax on your first home is',
          cy: 'Treth Trafodiadau Tir ac Adeiladau ar eich cartref cyntaf yw',
        })) ||
      (buyerType === 'nextHome' &&
        z({
          en: 'Land and Buildings Transaction Tax on your next home is',
          cy: 'Treth Trafodiadau Tir ac Adeiladau ar eich cartref nesaf yw',
        })) ||
      (buyerType === 'additionalHome' &&
        z({
          en: 'Land and Buildings Transaction Tax on your additional home is',
          cy: 'Treth Trafodiadau Tir ac Adeiladau ar eich cartref ychwanegol yw',
        }))
    );
  },

  validateForm: (input: LandTransactionTaxInput, z: TranslationFunction) => {
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

  howIsItCalculated: (
    input: LandTransactionTaxInput,
    isEmbedded: boolean,
    z: TranslationFunction,
  ) => {
    const { buyerType } = input;
    if (buyerType === 'firstTimeBuyer') {
      return z({
        en: (
          <>
            <Paragraph>
              Land and Buildings Transaction Tax (LBTT) is paid on the portion
              of the property price that’s within the relevant band when you buy
              a residential property.
            </Paragraph>
            <Paragraph>
              The table below shows the rates of LBTT a{' '}
              <strong>first-time buyer</strong> would pay.
            </Paragraph>
            <Table
              columnHeadings={[
                'Purchase price of property',
                'Rate of Land and Buildings Transaction Tax (LBTT)',
              ]}
              data={[
                ['Up to £175,000', '0%'],
                ['£175,001 - £250,000', '2%'],
                ['£250,001 - £325,000', '5%'],
                ['£325,001 - £750,000', '10%'],
                ['Over £750,000', '12%'],
              ]}
            />
            <Paragraph>
              First-time purchases above £175k will also benefit from the
              first-time buyer’s relief on the portion below the £175k
              threshold.
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Mae Treth Trafodiad Tir ac Adeiladau (LBTT) yn dreth a gymhwysir i
              drafodion tir ac adeiladau preswyl ac amhreswyl (gan gynnwys
              prydlesi masnachol).
            </Paragraph>
            <Paragraph>
              Mae’r tabl isod yn dangos pa gyfraddau LBTT byddai prynwr tro
              cyntaf yn eu talu.
            </Paragraph>
            <Table
              columnHeadings={[
                'Pris prynu’r eiddo',
                'Cyfradd Treth Trafodiadau Tir ac Adeiladau (LBTT)',
              ]}
              data={[
                ['Up to £175,000', '0%'],
                ['£175,001 - £250,000', '2%'],
                ['£250,001 - £325,000', '5%'],
                ['£325,001 - £750,000', '10%'],
                ['Dros £750,000', '12%'],
              ]}
            />
            <Paragraph>
              Bydd pryniannau tro cyntaf dros £175k hefyd yn elwa ar ryddhad
              prynwr tro cyntaf ar y gyfran o dan y trothwy £175k.
            </Paragraph>
          </>
        ),
      });
    } else if (buyerType === 'nextHome') {
      return z({
        en: (
          <>
            <Paragraph>
              Land and Buildings Transaction Tax (LBTT) is paid on the portion
              of the property price that’s within the relevant band when you buy
              a residential property.
            </Paragraph>
            <Paragraph>
              The table below shows the rates of LBTT{' '}
              <strong>someone buying their next home</strong> would pay.
            </Paragraph>
            <Table
              columnHeadings={[
                'Purchase price of property',
                'Rate of Land and Buildings Transaction Tax (LBTT)',
              ]}
              data={[
                ['Up to £145,000', '0%'],
                ['£145,001 - £250,000', '2%'],
                ['£250,001 - £325,000', '5%'],
                ['£325,001 - £750,000', '10%'],
                ['Over £750,000', '12%'],
              ]}
            />
            <Paragraph>
              Tax is payable at different rates on each portion of the purchase
              price within specified tax bands. If you buy a property for less
              than the threshold, there’s no LBTT to pay.
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Mae Treth Trafodiad Tir ac Adeiladau (LBTT) yn dreth a gymhwysir i
              drafodion tir ac adeiladau preswyl ac amhreswyl (gan gynnwys
              prydlesi masnachol).
            </Paragraph>
            <Paragraph>
              Mae’r tabl isod yn dangos pa gyfraddau LBTT byddai rhywun sy’n
              prynu ei gartref newydd yn eu talu.
            </Paragraph>
            <Table
              columnHeadings={[
                'Pris prynu’r eiddo',
                'Cyfradd Treth Trafodiadau Tir ac Adeiladau (LBTT)',
              ]}
              data={[
                ['Up to £145,000', '0%'],
                ['£145,001 - £250,000', '2%'],
                ['£250,001 - £325,000', '5%'],
                ['£325,001 - £750,000', '10%'],
                ['Dros £750,000', '12%'],
              ]}
            />
            <Paragraph>
              Mae treth yn daladwy ar gyfraddau gwahanol ar bob cyfran o’r pris
              prynu o fewn bandiau treth penodedig. Os prynwch eiddo am lai na’r
              trothwy, nid oes LBTT i’w dalu.
            </Paragraph>
          </>
        ),
      });
    } else if (buyerType === 'additionalHome') {
      return z({
        en: (
          <>
            <Paragraph>
              Land and Buildings Transaction Tax (LBTT) is paid on the portion
              of the property price that’s within the relevant band when you buy
              a residential property.
            </Paragraph>
            <Paragraph>
              The table below shows the rates of LBTT{' '}
              <strong>
                someone buying their additional property, or second home
              </strong>{' '}
              would pay.
            </Paragraph>
            <Table
              columnHeadings={[
                'Purchase price of property',
                'Rate of Land and Buildings Transaction Tax (LBTT)',
              ]}
              data={[
                ['Up to £145,000', '0%'],
                ['£145,001 - £250,000', '2%'],
                ['£250,001 - £325,000', '5%'],
                ['£325,001 - £750,000', '10%'],
                ['Over £750,000', '12%'],
              ]}
            />
            <Paragraph>
              Additional Dwelling Supplement (ADS) on second or additional
              residential property is applied at 8% of the total purchase price
              (paid in addition to any LBTT due). Properties under £40,000 are
              not subject to the Additional Dwelling Supplement (ADS).
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <Paragraph>
              Mae Treth Trafodiad Tir ac Adeiladau (LBTT) yn dreth a gymhwysir i
              drafodion tir ac adeiladau preswyl ac amhreswyl (gan gynnwys
              prydlesi masnachol).
            </Paragraph>
            <Paragraph>
              Mae’r tabl isod yn dangos pa gyfraddau LBTT byddai rhywun sy’n
              prynu ei gartref newydd yn eu talu.
            </Paragraph>
            <Table
              columnHeadings={[
                'Pris prynu’r eiddo',
                'Cyfradd Treth Trafodiadau Tir ac Adeiladau (LBTT)',
              ]}
              data={[
                ['Up to £145,000', '0%'],
                ['£145,001 - £250,000', '2%'],
                ['£250,001 - £325,000', '5%'],
                ['£325,001 - £750,000', '10%'],
                ['Dros £750,000', '12%'],
              ]}
            />
            <Paragraph>
              Mae Atodiad Annedd Ychwanegol (ADS) ar ail eiddo neu eiddo preswyl
              ychwanegol yn cael ei gymhwyso ar 8% o gyfanswm y pris prynu
              (wedi’i dalu yn ychwanegol at unrhyw LBTT sy’n ddyledus). Nid yw
              eiddo o dan £40,000 yn destun i’r Atodiad Annedd Ychwanegol (ADS).
            </Paragraph>
          </>
        ),
      });
    }
  },

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
                You might have to pay Land and Buildings Transaction Tax (LBTT)
                on residential and non-residential land and property
                transactions. It is the responsibility of the taxpayer to
                complete and submit an accurate LBTT return, where required, and
                pay any tax due. LBTT returns can be submitted using Revenue
                Scotland’s{' '}
                <Link
                  href="https://revenue.scot/taxes/scottish-electronic-tax-system-sets"
                  target={isEmbedded ? '_blank' : ''}
                >
                  online portal
                </Link>{' '}
                or a{' '}
                <Link
                  href="https://revenue.scot/taxes/land-buildings-transaction-tax/paper-lbtt-forms/paper-lbtt-return-forms"
                  target={isEmbedded ? '_blank' : ''}
                >
                  LBTT form
                </Link>
                . Further information can be found on:
              </>
            ),
            cy: (
              <>
                Efallai bydd yn rhaid i chi dalu Treth Trafodiadau Tir ac
                Adeiladau (LBTT) ar drafodion tir ac eiddo preswyl ac amhreswyl.
                Cyfrifoldeb y trethdalwr yw cwblhau a chyflwyno ffurflen LBTT
                gywir, lle bo angen, a thalu unrhyw dreth sy’n ddyledus. Gellir
                cyflwyno ffurflenni LBTT gan ddefnyddio porth ar-lein neu
                ffurflen LBTT Refeniw’r Alban. Gellir dod o hyd i fwy o
                wybodaeth ar:
              </>
            ),
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
            en: 'Land and Buildings Transaction Tax (LBTT) - Everything you need to know',
            cy: 'Treth Trafodiadau Tir ac Adeiladau (LBTT) - Popeth y mae angen i chi wybod',
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
      en: 'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
      cy: 'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
    }),
};
