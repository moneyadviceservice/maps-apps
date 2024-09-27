import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Question } from 'types/types';
import { SavingsCalculatorType } from 'components/SavingsCalculator/SavingsCalculator';
import { Options } from 'components/Select/Select';

export const getDayOptions = (): Options[] => {
  return new Array(31).fill(0).map((_, index) => {
    return {
      value: String(index + 1),
      text: String(index + 1),
    };
  });
};

export const getMonthOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): Options[] => {
  const months = [
    z({
      en: 'January',
      cy: 'Ionawr',
    }),
    z({
      en: 'February',
      cy: 'Chwefror',
    }),
    z({
      en: 'March',
      cy: 'Mawrth',
    }),
    z({
      en: 'April',
      cy: 'Ebrill',
    }),
    z({
      en: 'May',
      cy: 'Mai',
    }),
    z({
      en: 'June',
      cy: 'Mehefin',
    }),
    z({
      en: 'July',
      cy: 'Gorffennaf',
    }),
    z({
      en: 'August',
      cy: 'Awst',
    }),
    z({
      en: 'September',
      cy: 'Medi',
    }),
    z({
      en: 'October',
      cy: 'Hydref',
    }),
    z({
      en: 'November',
      cy: 'Tachwedd',
    }),
    z({
      en: 'December',
      cy: 'Rhagfyr',
    }),
  ];

  return months.map((month, index) => ({
    value: String(index),
    text: month,
  }));
};

export const getDurationOptions = (
  z: ReturnType<typeof useTranslation>['z'],
): Options[] => {
  return [
    {
      value: '52',
      text: z({
        en: 'Each week',
        cy: 'Bob wythnos',
      }),
    },
    {
      value: '12',
      text: z({
        en: 'Each month',
        cy: 'Bob mis',
      }),
    },
    {
      value: '1',
      text: z({
        en: 'Each year',
        cy: 'Bob blwyddyn',
      }),
    },
  ];
};

export const getYearOptions = (
  setYear = new Date(),
  duration = 100,
): Options[] => {
  const currentYear = setYear.getFullYear();
  const endYear = currentYear + duration;
  const years = Array.from(
    { length: endYear - currentYear + 1 },
    (_, index) => {
      const year = currentYear + index;
      return {
        value: year.toString(),
        text: year.toString(),
      };
    },
  );

  return years;
};

const savingGoalInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'savingGoal',
    title: z({
      en: 'What is your savings goal?',
      cy: 'Beth yw’ch nod cynilo?',
    }),
    errors: {
      required: z({
        en: 'Your savings goal can’t be blank',
        cy: 'Eich nod cynilo fod yn wag',
      }),
      invalid: z({
        en: 'Your savings goal must be in pounds only (no pence)',
        cy: 'Eich nod cynilo rhaid iddo fod yn bunnoedd yn unig (dim ceiniogau)',
      }),
      max: z({
        en: 'Your savings goal is too long (maximum is 9 characters)',
        cy: 'Eich nod cynilo yn rhy hir (uchafswm yw 9 o nodau)',
      }),
      min: z({
        en: 'Your savings goal must be greater than 0',
        cy: 'Eich nod cynilo fod yn fwy na 0',
      }),
    },
  };
};

const savedInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'saved',
    title: z({
      en: 'How much have you saved already? (optional)',
      cy: 'Faint ydych wedi’i gynilo eisoes? (Dewisol)',
    }),
    errors: {
      invalid: z({
        en: 'The amount you have saved already must be in pounds only (no pence)',
        cy: 'Y swm y gallwch ei gynilo rhaid iddo fod yn bunnoedd yn unig (dim ceiniogau)',
      }),
      max: z({
        en: 'The amount you have saved already is too long (maximum is 9 characters)',
        cy: 'Y swm y gallwch ei gynilo yn rhy hir (uchafswm yw 9 o nodau)',
      }),
    },
  };
};

const interestInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'PercentInput',
    answers: [],
    type: 'interest',
    title: z({
      en: 'Gross annual interest rate on your savings (optional)',
      cy: 'Cyfradd llog blynyddol crynswth ar eich cynilion (Dewisol)',
    }),
    errors: {
      invalid: z({
        en: 'Gross annual interest rate must not have more than 2 decimal places',
        cy: 'Cyfradd llog blynyddol gros rhaid iddo beidio â chael mwy na 2 le degol',
      }),
      max: z({
        en: 'Gross annual interest rate is too long (maximum is 6 characters)',
        cy: 'Cyfradd llog blynyddol gros yn rhy hir (uchafswm yw 6 o nodau)',
      }),
    },
  };
};

const savedDateInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'MoneyInput',
    answers: [],
    type: 'amount',
    title: z({
      en: 'How much can you save?',
      cy: 'Faint allwch chi ei gynilo?',
    }),
    errors: {
      required: z({
        en: 'The amount you save can’t be blank',
        cy: 'Y swm y gallwch ei gynilo fod yn wag',
      }),
      invalid: z({
        en: 'The amount you can save must be in pounds only (no pence)',
        cy: 'Y swm y gallwch ei gynilo rhaid iddo fod yn bunnoedd yn unig (dim ceiniogau)',
      }),
      max: z({
        en: 'The amount you can save is too long (maximum is 9 characters)',
        cy: 'Y swm y gallwch ei gynilo yn rhy hir (uchafswm yw 9 o nodau)',
      }),
    },
  };
};

const savedAmountInput = (
  questionNbr: number,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  return {
    questionNbr: questionNbr,
    group: 'DateInput',
    answers: [],
    type: 'date',
    title: z({
      en: 'When do you need your savings by?',
      cy: 'Erbyn pryd fyddwch angen eich cynilion?',
    }),
    errors: {
      invalid: z({
        en: 'The date you need your savings by cannot be in the past',
        cy: 'Y dyddiad rydych angen eich cynilion erbyn ni all fod yn y gorffennol',
      }),
      required: z({
        en: 'The date you need your savings by cannot be in the current month',
        cy: 'Y dyddiad rydych angen eich cynilion erbyn ni all fod yn y mis presenno',
      }),
    },
  };
};

export const savingsCalculatorHowMuch = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    savingGoalInput(1, z),
    savedAmountInput(2, z),
    savedInput(3, z),
    interestInput(4, z),
  ];
};

export const savingsCalculatorHowLong = (
  z: ReturnType<typeof useTranslation>['z'],
): Array<Question> => {
  return [
    savingGoalInput(1, z),
    savedDateInput(2, z),
    savedInput(3, z),
    interestInput(4, z),
  ];
};

export const getInputs = (
  z: ReturnType<typeof useTranslation>['z'],
  type: SavingsCalculatorType,
): Question[] => {
  switch (type) {
    case SavingsCalculatorType.HOW_LONG:
      return savingsCalculatorHowLong(z);
    case SavingsCalculatorType.HOW_MUCH:
      return savingsCalculatorHowMuch(z);
    default:
      return {} as any;
  }
};
