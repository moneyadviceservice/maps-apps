import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Question } from '@maps-react/form/types';

export const creditRejectionQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'Have you been declined for credit in the past six months?',
        cy: 'Ydych chi wedi cael eich gwrthod am gredyd yn ystod y chwe mis diwethaf?',
      }),
      type: 'single',
      subType: 'yesNo',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Do' }),
        },
        {
          text: z({ en: 'No', cy: 'Naddo' }),
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: z({
        en: 'Have you checked your credit report for errors in the last month?',
        cy: 'Ydych chi wedi gwirio eich adroddiad credyd am wallau yn y mis diwethaf?',
      }),
      type: 'single',
      subType: 'yesNo',
      definition: z({
        en: "Three agencies hold your credit report - Experian, Equifax and TransUnion - so it's best to check all three.",
        cy: "Mae tair asiantaeth yn dal eich adroddiad credyd - Experian, Equifax a TransUnion - felly mae'n syniad da i wirio pob un.",
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'Do you have any of these accounts in your name?',
        cy: "Oes gennych unrhyw un o'r cyfrifon hyn yn eich enw?",
      }),
      type: 'multiple',
      definition: z({
        en: 'Select all that apply',
        cy: "Dewiswch bob un sy'n berthnasol.",
      }),
      answers: [
        {
          text: z({
            en: 'Bank account(s) with active direct debit(s)',
            cy: 'Cyfrif(on) banc gyda debyd(au) uniongyrchol actif',
          }),
          clearAll: false,
        },
        {
          text: z({
            en: 'Household bill(s) - like gas, electricity, broadband, mobile phone and insurance',
            cy: 'Bil(iau) cartref - fel nwy, trydan, band eang, ffôn symudol ac yswiriant',
          }),
          clearAll: false,
        },
        {
          text: z({
            en: 'None of these',
            cy: "Dim o'r rhain",
          }),
          clearAll: true,
        },
      ],
    },
    {
      questionNbr: 4,
      group: '',
      title: z({
        en: 'Do any of the accounts in your name use old details?',
        cy: "A yw unrhyw un o'r cyfrifon yn eich enw yn defnyddio hen fanylion?",
      }),
      type: 'single',
      subType: 'yesNo',
      definition: z({
        en: 'Like a previous address or name.',
        cy: 'Fel cyfeiriad neu enw blaenorol.',
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydyn' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydyn' }),
        },
      ],
    },
    {
      questionNbr: 5,
      group: '',
      title: z({
        en: 'Are you paying back any borrowing?',
        cy: "Ydych chi'n ad-dalu unrhyw fenthyciad?",
      }),
      type: 'single',
      subType: 'yesNo',
      definition: z({
        en: 'Other than a mortgage, like loan and credit card repayments.',
        cy: 'Heblaw am forgais, fel ad-daliadau benthyciad a cherdyn credyd.',
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
    {
      questionNbr: 6,
      group: '',
      title: z({
        en: 'Do you always pay your bills on time?',
        cy: 'Ydych chi bob amser yn talu eich biliau ar amser?',
      }),
      type: 'single',
      subType: 'yesNo',
      definition: z({
        en: 'Like mobile phone, gas, electricity, loan and credit card repayments. Select "No" if you\'re worried you\'ll miss a payment, or already have.',
        cy: "Fel ad-daliadau ffôn symudol, nwy, trydan, benthyciad a cherdyn credyd. Dewiswch 'Nac ydw' os ydych yn poeni y byddwch yn methu taliad, neu eisoes wedi.",
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
    {
      questionNbr: 7,
      group: '',
      title: z({
        en: 'Have you registered to vote at your current address?',
        cy: 'Ydych chi wedi cofrestru i bleidleisio yn eich cyfeiriad presennol?',
      }),
      type: 'single',
      subType: 'yesNo',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac ydw' }),
        },
      ],
    },
    {
      questionNbr: 8,
      group: '',
      title: z({
        en: 'Do you have joint finances with someone?',
        cy: 'Oes gennych chi gyllid ar y cyd â rhywun?',
      }),
      type: 'single',
      subType: 'yesNo',
      definition: z({
        en: 'Like a joint bank account or a mortgage.',
        cy: 'Fel cyfrif banc ar y cyd neu forgais.',
      }),
      target: '/change-options',
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Oes' }),
        },
        {
          text: z({ en: 'No', cy: 'Nac oes' }),
        },
      ],
    },
  ];
};
