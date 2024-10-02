import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Question } from '../../../types';

export const creditOptionsQuestions = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    {
      questionNbr: 1,
      group: '',
      title: z({
        en: 'How much do you need to borrow?',
        cy: 'Faint sydd angen i chi ei fenthyca?',
      }),
      type: 'moneyInput',
      inputProps: {
        maxLimit: 50000,
        labelValue: z({
          en: 'Please enter an amount up to £50,000',
          cy: 'Rhowch swm hyd at £50,000',
        }),
      },
      answers: [
        {
          text: '',
          score: 0,
          clearAll: false,
        },
      ],
    },
    {
      questionNbr: 2,
      group: '',
      title: z({
        en: 'What do you need the money for?',
        cy: 'Ar gyfer beth ydych chi angen yr arian?',
      }),
      type: 'single',
      answers: [
        {
          text: z({
            en: 'Planned purchase – like a holiday, wedding, home improvements or buying a new TV',
            cy: "Pryniant wedi'i gynllunio – fel gwyliau, priodas, gwelliannau i'r cartref neu brynu teledu newydd",
          }),
        },
        {
          text: z({ en: 'Buy a car', cy: 'Prynu car' }),
        },
        {
          text: z({
            en: 'Pay off or combine debt',
            cy: 'Talu neu gyfuno dyled',
          }),
        },
        {
          text: z({
            en: 'Essential items – like food and school uniform',
            cy: 'Eitemau hanfodol – fel bwyd a gwisg ysgol',
          }),
        },
        {
          text: z({
            en: 'Emergency or unplanned expense',
            cy: 'Costau brys neu heb eu cynllunio',
          }),
        },
      ],
    },
    {
      questionNbr: 3,
      group: '',
      title: z({
        en: 'How long could you wait for the money?',
        cy: 'Pa mor hir allwch chi ddisgwyl am yr arian?',
      }),
      type: 'single',
      definition: z({
        en: "There are usually more (and cheaper) borrowing options if you're able to wait at least a week.",
        cy: 'Fel arfer mae mwy o opsiynau benthyca (a rhatach) os ydych yn gallu aros o leiaf wythnos.',
      }),
      answers: [
        {
          text: z({
            en: 'A few hours',
            cy: 'Ychydig oriau',
          }),
        },
        {
          text: z({
            en: 'A few days',
            cy: 'Ychydig ddyddiau',
          }),
        },
        {
          text: z({
            en: 'A week or more',
            cy: 'Wythnos neu fwy',
          }),
        },
      ],
    },
    {
      questionNbr: 4,
      group: '',
      title: z({
        en: 'How quickly could you repay the money?',
        cy: "Pa mor gyflym y gallwch chi dalu'r arian ôl?",
      }),
      type: 'single',
      answers: [
        {
          text: z({ en: 'Less than a month', cy: 'Llai na mis' }),
        },
        {
          text: z({ en: '1 to 6 months', cy: '1 i 5 mis' }),
        },
        {
          text: z({ en: '6 months to 1 year', cy: '6 mis i 1 flwyddyn' }),
        },
        {
          text: z({ en: '1 to 2 years', cy: '1 i 2 flynedd' }),
        },
        {
          text: z({ en: 'Over 2 years', cy: 'Dros 2 flynedd' }),
        },
      ],
    },
    {
      questionNbr: 5,
      group: '',
      title: z({
        en: 'Have you ever been refused credit?',
        cy: 'A ydych erioed wedi cael credyd wedi’i wrthod?',
      }),
      type: 'single',
      subType: 'yesNo',
      definition: z({
        en: 'Answer ‘yes’ if you’ve ever had an application for credit declined, like a credit card, store card, loan or overdraft.',
        cy: "Atebwch 'ydw' os ydych erioed wedi cael cais am gredyd wedi’i wrthod, fel cerdyn credyd, cerdyn siop, benthyciad neu orddrafft.",
      }),
      answers: [
        {
          text: z({ en: 'Yes', cy: 'Ydw' }),
        },
        {
          text: z({ en: 'No', cy: 'Na' }),
        },
      ],
    },
    {
      questionNbr: 6,
      group: '',
      title: z({
        en: 'How good is your credit score?',
        cy: 'Pa mor dda yw eich sgôr credyd?',
      }),
      type: 'single',
      definition: z({
        en: 'Some products might not be available to you, depending on your credit score. If you’re not sure, see how to check your credit report for free.',
        cy: "Efallai na fydd rhai cynhyrchion ar gael i chi, yn dibynnu ar eich sgôr credyd. Os nad ydych yn siŵr, edrychwch ar sut i wirio'ch adroddiad credyd am ddim.",
      }),
      target: '/change-options',
      answers: [
        {
          text: z({ en: 'Good or excellent', cy: 'Da neu ardderchog' }),
        },
        {
          text: z({ en: 'Fair or ok', cy: 'Teg neu iawn' }),
        },
        {
          text: z({ en: 'Poor', cy: 'Gwael' }),
        },
        {
          text: z({
            en: 'Not sure, show me all options',
            cy: 'Ddim yn siŵr, dangoswch yr holl opsiynau i mi',
          }),
        },
      ],
    },
  ];
};
