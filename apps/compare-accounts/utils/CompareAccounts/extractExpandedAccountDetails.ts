import { AccountProps } from '../../components/CompareAccounts/CompareAccounts';
import formatMoney from './formatMoney';
import formatPercentage from './formatPercentage';
import { Account } from './hydrateAccountFromJson';
type AccountDetailsProps = {
  title?: string;
  sections: Array<AccountSectionProps>;
};

type AccountSectionProps = {
  title?: string;
  items: Array<AccountItemsProps>;
};

type AccountItemsProps = {
  type: string;
  title?: string;
  value: string | null;
};

type TranslationFunction = (arg0: { en: string; cy: string }) => string;

const extractExpandedAccountDetails = (
  account: Account | AccountProps,
  z: TranslationFunction,
): Array<AccountDetailsProps> => {
  return [
    {
      title: z({
        en: 'General account fees',
        cy: 'Ffioedd cyfrif cyffredinol',
      }),
      sections: [
        {
          items: [
            {
              type: 'detail',
              title: z({
                en: 'Maintaining the account',
                cy: 'Cynnal y cyfrif',
              }),
              value: formatMoney(account.monthlyFee),
            },
            {
              type: 'read-more',
              value: account.monthlyChargeBrochure,
            },
            {
              type: 'detail',
              title: z({
                en: 'Minimum monthly deposit',
                cy: 'Lleiafswm blaendal misol ',
              }),
              value: formatMoney(account.minimumMonthlyCredit),
            },
            {
              type: 'read-more',
              value: account.minimumMonthlyCreditBrochure,
            },
          ],
        },
      ],
    },
    {
      title: z({ en: 'Overdraft fees', cy: 'Ffioedd gorddrafft' }),
      sections: [
        {
          title: z({
            en: 'Arranged overdraft',
            cy: "Gorddrafft wedi'i drefnu",
          }),
          items: account.overdraftFacility
            ? [
                {
                  type: 'detail',
                  title: z({
                    en: 'Annual interest rate (APR)',
                    cy: 'Cyfradd llog blynyddol (APR)',
                  }),
                  value: formatPercentage(account.representativeAPR),
                },
                {
                  type: 'detail',
                  title: z({
                    en: 'Example - £ cost overdrawn for 7 days',
                    cy: 'Enghraifft - £ cost bod yn ddyledus am 7 diwrnod',
                  }),
                  value: formatMoney(account.arrangedODExample1),
                },
                {
                  type: 'detail',
                  title: z({
                    en: 'Example - £ cost overdrawn for 30 days',
                    cy: 'Enghraifft - £ cost bod yn ddyledus am 30 diwrnod',
                  }),
                  value: formatMoney(account.arrangedODExample2),
                },
                {
                  type: 'read-more',
                  value: account.arrangedODDetailBrochure,
                },
              ]
            : [
                {
                  type: 'detail',
                  value: account.arrangedODDetailBrochure,
                },
              ],
        },
        {
          title: z({
            en: 'Unarranged overdraft',
            cy: 'Gorddrafft heb ei drefnu',
          }),
          items: account.overdraftFacility
            ? [
                {
                  type: 'detail',
                  title: z({
                    en: 'Annual interest rate (APR/EAR)',
                    cy: 'Cyfradd llog blynyddol (APR/EAR)',
                  }),
                  value: formatPercentage(account.unauthorisedOverdraftEar),
                },
                {
                  type: 'detail',
                  title: z({
                    en: 'Monthly Maximum Charge',
                    cy: 'Uchafswm Tâl Misol',
                  }),
                  value: account.unauthODMonthlyCap
                    ? formatMoney(account.unauthODMonthlyCap)
                    : 'No limit',
                },
                {
                  type: 'read-more',
                  value: account.unarrangedODDetailBrochure,
                },
              ]
            : [
                {
                  type: 'detail',
                  value: account.unarrangedODDetailBrochure,
                },
              ],
        },
        {
          title: z({
            en: 'Other related fees',
            cy: 'Ffioedd cysylltiedig eraill',
          }),
          items: [
            {
              type: 'detail',
              title: z({
                en: 'Refusing a payment due to a lack of funds',
                cy: 'Gwrthod taliad oherwydd diffyg arian',
              }),
              value: account.unpaidItemDetail,
            },
            {
              type: 'detail',
              title: z({
                en: 'Allowing a payment despite a lack of funds',
                cy: 'Caniatáu taliad er gwaethaf diffyg arian',
              }),
              value: account.paidItemDetail
                ? account.paidItemDetail.charAt(0).toUpperCase() +
                  account.paidItemDetail.slice(1)
                : '',
            },
          ],
        },
      ],
    },
    {
      title: z({ en: 'Debit card fees', cy: 'Ffioedd cerdyn debyd' }),
      sections: [
        {
          items: [
            {
              type: 'detail',
              title: z({ en: 'Card issue fee', cy: 'Ffi rhoi cerdyn' }),
              value: formatMoney(account.debitCardIssueFee),
            },
            {
              type: 'detail',
              title: z({
                en: 'Card replacement fee',
                cy: 'Ffi amnewid cerdyn',
              }),
              value: formatMoney(account.debitCardReplacementFee),
            },
            {
              type: 'read-more',
              value: account.debitCardReplacementFeeBrochure,
            },
          ],
        },
        {
          title: z({ en: 'In pounds in the UK', cy: 'Mewn punnoedd yn y DU' }),
          items: [
            {
              type: 'detail',
              title: z({
                en: '£ cost per debit card transaction',
                cy: 'Cost fesul trafodiad cerdyn debyd',
              }),
              value: formatMoney(account.transactionFee),
            },
            {
              type: 'read-more',
              value: account.transactionFeeBrochure,
            },
          ],
        },
        {
          title: z({
            en: 'In a foreign currency outside of the UK',
            cy: "Mewn arian cyfred tramor y tu allan i'r DU",
          }),
          items: [
            {
              type: 'detail',
              title: z({
                en: 'Example - £50 debit card transaction in the EU',
                cy: 'Enghraifft - trafodiad cerdyn debyd £50 yn yr UE',
              }),
              value: formatMoney(account.debitEU50Cost),
            },
            {
              type: 'detail',
              title: z({
                en: 'Example - £50 debit card transaction worldwide',
                cy: 'Enghraifft - trafodiad cerdyn debyd £50 yn yr UE',
              }),
              value: formatMoney(account.debitWorld50Cost),
            },
            {
              type: 'read-more',
              value: account.intDebitCardPayDetail,
            },
          ],
        },
      ],
    },
    {
      title: z({ en: 'Cash withdrawal fees', cy: 'Ffioedd codi arian parod' }),
      sections: [
        {
          title: z({ en: 'In pounds in the UK', cy: 'Mewn punnoedd yn y DU' }),
          items: [
            {
              type: 'detail',
              title: z({
                en: 'Limit of fee-free cash withdrawals',
                cy: 'Terfyn ar godi arian parod di-dâl',
              }),
              value: account.atmMaxFreeWithdrawalUK
                ? formatMoney(account.atmMaxFreeWithdrawalUK)
                : 'No limit',
            },
            {
              type: 'detail',
              title: z({
                en: '£ cost per withdrawal',
                cy: 'cost fesul codi arian',
              }),
              value: formatMoney(account.atmWithdrawalCharge),
            },
            {
              type: 'detail',
              title: z({
                en: '% cost per withdrawal',
                cy: 'cost fesul codi arian',
              }),
              value: formatPercentage(account.atmWithdrawalChargePercent),
            },
            {
              type: 'read-more',
              value: account.ukCashWithdrawalDetail,
            },
          ],
        },
        {
          title: z({
            en: 'In a foreign currency outside of the UK',
            cy: "Mewn arian cyfred tramor y tu allan i'r DU",
          }),
          items: [
            {
              type: 'detail',
              title: z({
                en: 'Example - withdrawing £50 in the EU',
                cy: 'Enghraifft - codi £50 yn ôl yn yr UE',
              }),
              value: formatMoney(account.atmEU50Cost),
            },
            {
              type: 'detail',
              title: z({
                en: 'Example - withdrawing £50 worldwide',
                cy: 'Enghraifft - codi £50 byd-eang',
              }),
              value: formatMoney(account.atmWorld50Cost),
            },
            {
              type: 'read-more',
              value: account.intCashWithdrawDetail,
            },
          ],
        },
      ],
    },
    {
      title: z({ en: 'Payment fees', cy: 'Ffioedd taliadau' }),
      sections: [
        {
          title: z({
            en: 'Sending money within the UK',
            cy: 'Anfon arian o fewn y DU',
          }),
          items: [
            {
              type: 'detail',
              title: z({ en: 'Direct debit', cy: 'Debyd uniongyrchol' }),
              value: formatMoney(account.directDebitCharge),
            },
            {
              type: 'detail',
              title: z({ en: 'Standing order', cy: 'Archeb sefydlog' }),
              value: formatMoney(account.standingOrderCharge),
            },
            {
              type: 'detail',
              title: z({ en: 'BACS payment', cy: 'Taliad BACS' }),
              value: formatMoney(account.bacsCharge),
            },
            {
              type: 'detail',
              title: z({ en: 'Faster Payments', cy: 'Taliadau Cyflymach' }),
              value: formatMoney(account.fasterPaymentsCharge),
            },
            {
              type: 'detail',
              title: z({ en: 'CHAPS', cy: 'CHAPS' }),
              value: formatMoney(account.chapsCharge),
            },
          ],
        },
        {
          title: z({
            en: 'Sending money outside of the UK',
            cy: "Anfon arian tu allan i'r DU",
          }),
          items: [
            {
              type: 'detail',
              title: z({ en: 'To the EU', cy: "I'r UE" }),
              value: account.payOutEUMaxChrg
                ? [
                    formatMoney(account.payOutEUMinChrg),
                    formatMoney(account.payOutEUMaxChrg),
                  ].join(' - ')
                : [
                    'Minimum charge: ',
                    formatMoney(account.payOutEUMinChrg),
                  ].join(''),
            },
            {
              type: 'detail',
              title: z({ en: 'To worldwide', cy: 'I fyd-eang' }),
              value: account.payOutWorldMaxChrg
                ? [
                    formatMoney(account.payOutWorldMinChrg),
                    formatMoney(account.payOutWorldMaxChrg),
                  ].join(' - ')
                : [
                    'Minimum charge: ',
                    formatMoney(account.payOutWorldMinChrg),
                  ].join(''),
            },
            {
              type: 'read-more',
              value: account.intPaymentsOutDetail,
            },
          ],
        },
        {
          title: z({
            en: 'Receiving money from outside of the UK',
            cy: "Derbyn arian o du allan i'r DU",
          }),
          items: [
            {
              type: 'detail',
              title: z({ en: 'From the EU', cy: "O'r EU" }),
              value:
                formatMoney(account.payInEUMinChrg) +
                ' - ' +
                formatMoney(account.payInEUMaxChrg),
            },
            {
              type: 'detail',
              title: z({ en: 'From worldwide', cy: 'O fyd-eang' }),
              value:
                formatMoney(account.payInWorldMinChrg) +
                ' - ' +
                formatMoney(account.payInWorldMaxChrg),
            },
            {
              type: 'read-more',
              value: account.intPaymentsInDetail,
            },
          ],
        },
      ],
    },
    {
      title: z({ en: 'Other fees', cy: 'Ffioedd eraill' }),
      sections: [
        {
          items: [
            {
              type: 'detail',
              title: z({ en: 'Cancelling a cheque', cy: 'Diddymu siec' }),
              value: formatMoney(account.stoppedChequeCharge),
            },
            {
              type: 'detail',
              title: z({ en: 'Other charges', cy: 'Taliadau eraill' }),
              value: account.otherChargesBrochure,
            },
          ],
        },
      ],
    },
  ];
};

export default extractExpandedAccountDetails;
