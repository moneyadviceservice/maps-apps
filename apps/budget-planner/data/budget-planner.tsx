import GetHelpWithYourBills from '../public/images/laughing-elderly-couple.png';
import BenefitsCalculator from '../public/images/smiling-young-man-and-woman-looking-at-mobile-phone.png';
import DebtAdvice from '../public/images/woman-with-laptop-reading-a-bill.jpg';
import SavingsCalculator from '../public/images/womans-hands-opening-red-purse.jpg';

const MONTHLY_FREQUENCY = 30.416666666666668;

export type Fields = {
  readonly name: string;
  readonly group: string;
  createAdditionalItems?: (section: string) => object;
  defaultFactorValue: number;
};

type Tabs = {
  readonly name: string;
  readonly colour?: string;
  readonly nextTab?: string;
  readonly function?: (value: number, total?: number) => number;
  readonly fields?: Fields[];
};

type Select = {
  readonly name: string;
  readonly welshName: string;
  readonly value: number;
};

type SelectName =
  | 'day'
  | 'week'
  | '2-weeks'
  | '4-weeks'
  | 'month'
  | 'quarter'
  | '6-months'
  | 'year';

export const select: Select[] = [
  {
    name: 'day',
    welshName: 'Dydd',
    value: MONTHLY_FREQUENCY,
  },
  {
    name: 'week',
    welshName: 'Wythnos',
    value: MONTHLY_FREQUENCY / 7,
  },
  {
    name: '2-weeks',
    welshName: '2 wythnos',
    value: MONTHLY_FREQUENCY / 14,
  },
  {
    name: '4-weeks',
    welshName: '4 wythnos',
    value: MONTHLY_FREQUENCY / 28,
  },
  {
    name: 'month', // @note: Standard unit, 30 days.
    welshName: 'Mis',
    value: 1,
  },
  {
    name: 'quarter',
    welshName: 'Chwarter',
    value: 1 / 3,
  },
  {
    name: '6-months',
    welshName: '6 mis',
    value: 1 / 6,
  },
  {
    name: 'year',
    welshName: 'Blwyddyn',
    value: 1 / 12,
  },
];

function add(value: number, total?: number) {
  return (total || 0) + value;
}

function subtract(value: number, total?: number) {
  return (total || 0) - value;
}

function getFactorValue(selectName: SelectName): number {
  const result = select.find((item) => item.name === selectName);
  return result?.value ?? 1;
}

export const API_ENDPOINT = '/api';
const ADDITIONAL_ITEMS = 5;

export const createAdditionalItems = (section: string) =>
  Array.from({ length: ADDITIONAL_ITEMS }, (_, index) => ({
    group: 'additional',
    type: 'text',
    name: `${section}-additional-field-${index}`,
    defaultFactorValue: 1,
  }));

const tabs: Tabs[] = [
  {
    name: 'income',
    nextTab: `household-bills`,
    function: add,
    fields: [
      // PAY
      {
        defaultFactorValue: 1,
        name: 'pay',
        group: 'pay',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'self-employment',
        group: 'pay',
      },
      {
        defaultFactorValue: 1,
        name: 'statutory-pay-sick',
        group: 'pay',
      },
      {
        defaultFactorValue: 1,
        name: 'statutory-maternity-pay',
        group: 'pay',
      },
      // BENEFITS AND TAX CREDITS
      {
        defaultFactorValue: 1,
        name: 'universal-credit',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'child-benefit',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('2-weeks'),
        name: 'jobseekers-allowance',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('2-weeks'),
        name: 'esa-or-incapacity-benefit',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'independence-payment',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: 1,
        name: 'pension-credit',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'attendance-allowance',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'carers-allowance',
        group: 'benefits-and-tax-credits',
      },
      {
        defaultFactorValue: 1,
        name: 'housing-benefit',
        group: 'benefits-and-tax-credits',
      },
      // PENSIONS
      {
        defaultFactorValue: getFactorValue('4-weeks'),
        name: 'state-pension',
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'workplace-pension',
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'annuity',
        group: 'pension',
      },
      {
        defaultFactorValue: 1,
        name: 'drawdown',
        group: 'pension',
      },
      // OTHER INCOME
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'savings-investments',
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'rent-or-board',
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'child-maintenance',
        group: 'other-income',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'student-loans-and-grants',
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'other-financial-support',
        group: 'other-income',
      },
      {
        defaultFactorValue: 1,
        name: 'gifts',
        group: 'other-income',
      },
      ...createAdditionalItems('income'),
    ],
  },
  {
    name: 'household-bills',
    colour: '#00788E',
    nextTab: `living-costs`,
    function: subtract,
    fields: [
      // MORTGAGE & RENT
      {
        defaultFactorValue: 1,
        name: 'mortgage',
        group: 'mortgage-rent',
      },
      {
        defaultFactorValue: 1,
        name: 'rent',
        group: 'mortgage-rent',
      },
      {
        defaultFactorValue: 1,
        name: 'endowment',
        group: 'mortgage-rent',
      },
      {
        defaultFactorValue: 1,
        name: 'insurance',
        group: 'mortgage-rent',
      },
      // OTHER PROPERTY CHARGES
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'ground-rent',
        group: 'other-property',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'service-charge',
        group: 'other-property',
      },
      // HOME INSURANCE
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'buildings-insurance',
        group: 'home-insurance',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'contents-insurance',
        group: 'home-insurance',
      },
      // UTILITIES
      {
        defaultFactorValue: 1,
        name: 'council-tax',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'gas',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'electricity',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'other-fuel',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'water',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'home-phone',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'mobile',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'tv-licence',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'cabel-or-satellite-tv',
        group: 'utilities',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'home-maintenance',
        group: 'utilities',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'garden-maintenance',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'appliance-rental',
        group: 'utilities',
      },
      {
        defaultFactorValue: 1,
        name: 'boiler-cover',
        group: 'utilities',
      },
      ...createAdditionalItems('householdbills'),
    ],
  },
  {
    name: 'living-costs',
    colour: '#E67032',
    nextTab: `finance-insurance`,
    function: subtract,
    fields: [
      // FOOD & DRINK
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'grocery-shopping',
        group: 'food-drink',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'takeaways',
        group: 'food-drink',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'alcohol-at-home',
        group: 'food-drink',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'smoking-and-vaping',
        group: 'food-drink',
      },
      // WORK
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'lunches-snacks',
        group: 'work',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'takeaway-coffees',
        group: 'work',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'union-professional-fees',
        group: 'work',
      },
      // CLOTHES & SHOES
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'clothes',
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'shoes',
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'work-clothes',
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'childrens-clothes',
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'school-uniform',
        group: 'clothes-shoes',
      },
      {
        defaultFactorValue: 1,
        name: 'laundry-and-dry-cleaning',
        group: 'clothes-shoes',
      },
      // HEALTH & BEAUTY
      {
        defaultFactorValue: getFactorValue('quarter'),
        name: 'hairdressing',
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('quarter'),
        name: 'beauty-treatments',
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'toiletries',
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'eye-care',
        group: 'health-beauty',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'dental-care',
        group: 'health-beauty',
      },
      {
        defaultFactorValue: 1,
        name: 'prescriptions-medicines',
        group: 'health-beauty',
      },
      ...createAdditionalItems('living-costs'),
    ],
  },
  {
    name: 'finance-insurance',
    colour: '#AD0060',
    nextTab: `family-friends`,
    function: subtract,
    fields: [
      {
        defaultFactorValue: 1,
        name: 'life-insurance',
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'protection-insurance',
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'critical-illness-insurance',
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'health-insurance',
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'dental-insurance',
        group: 'insurance',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'overdraft-charges-interest',
        group: 'banking',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'bank-account-fees',
        group: 'banking',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'penalties',
        group: 'banking',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'loan-repayments',
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'student-loan-repayments',
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'credit-card-repayments',
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'car-hire-payments',
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'buy-now-pay-later',
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'other-credit-repayments',
        group: 'credit',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'regular-saving',
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'lump-sum-savings',
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'payments-isas',
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'buying-shares',
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'private-pensions',
        group: 'savings-investments',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'long-term-care',
        group: 'future-plans',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'funeral-plan',
        group: 'future-plans',
      },
      {
        defaultFactorValue: getFactorValue('week'),
        name: 'financial-advice',
        group: 'financial-advice',
      },
      ...createAdditionalItems('finance-insurance'),
    ],
  },
  {
    name: 'family-friends',
    colour: '#7F992F',
    nextTab: `travel`,
    function: subtract,
    fields: [
      // CHILDREN
      {
        name: 'childcare',
        defaultFactorValue: 1,
        group: 'children',
      },
      {
        name: 'nappies',
        defaultFactorValue: 1,
        group: 'children',
      },
      {
        name: 'activities',
        defaultFactorValue: 1,
        group: 'children',
      },
      {
        name: 'treats',
        defaultFactorValue: 1,
        group: 'children',
      },
      {
        name: 'pocket-money',
        defaultFactorValue: getFactorValue('week'),
        group: 'children',
      },
      {
        name: 'babysitting',
        defaultFactorValue: 1,
        group: 'children',
      },
      {
        name: 'maintenance',
        defaultFactorValue: 1,
        group: 'children',
      },
      // SCHOOL
      {
        name: 'school-fees',
        defaultFactorValue: getFactorValue('year'),
        group: 'school',
      },
      {
        name: 'school-trips',
        defaultFactorValue: getFactorValue('year'),
        group: 'school',
      },
      {
        name: 'school-dinners',
        defaultFactorValue: getFactorValue('year'),
        group: 'school',
      },
      {
        name: 'school-clubs',
        defaultFactorValue: getFactorValue('year'),
        group: 'school',
      },
      // SUPPORT FOR STUDENT CHILDREN
      {
        name: 'support-student',
        defaultFactorValue: 1,
        group: 'support-student',
      },
      // SUPPORT FOR OTHER RELATIVES
      {
        name: 'support-relatives',
        defaultFactorValue: 1,
        group: 'support-relatives',
      },
      // PETS
      {
        name: 'pet-food',
        defaultFactorValue: getFactorValue('week'),
        group: 'pets',
      },
      {
        name: 'vet-bills',
        defaultFactorValue: getFactorValue('year'),
        group: 'pets',
      },
      {
        name: 'pet-insurance',
        defaultFactorValue: 1,
        group: 'pets',
      },
      // DONATIONS
      {
        name: 'donations',
        defaultFactorValue: 1,
        group: 'donations',
      },
      // FAMILY LOAN
      {
        name: 'loan',
        defaultFactorValue: 1,
        group: 'family-loan',
      },
      ...createAdditionalItems('family-friends'),
    ],
  },
  {
    name: 'travel',
    colour: '#000B3A',
    nextTab: `leisure`,
    function: subtract,
    fields: [
      {
        defaultFactorValue: 1,
        name: 'petrol-diesel',
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'car-insurance',
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'breakdown-cover',
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'car-tax',
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'car-finance',
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'loan-insurance',
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'mot',
        group: 'car-costs',
      },
      {
        defaultFactorValue: getFactorValue('year'),
        name: 'maintenance',
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'parking',
        group: 'car-costs',
      },
      {
        defaultFactorValue: 1,
        name: 'bus',
        group: 'public-transport',
      },
      {
        defaultFactorValue: 1,
        name: 'trains',
        group: 'public-transport',
      },
      {
        defaultFactorValue: 1,
        name: 'taxis',
        group: 'public-transport',
      },
      {
        defaultFactorValue: 1,
        name: 'air',
        group: 'public-transport',
      },
      ...createAdditionalItems('travel'),
    ],
  },
  {
    name: 'leisure',
    colour: '#8E2A9E',
    nextTab: `summary`,
    function: subtract,
    fields: [
      {
        name: 'cinema-theatre-trips',
        defaultFactorValue: 1,
        group: 'entertainment',
      },
      {
        name: 'days-out',
        defaultFactorValue: 1,
        group: 'entertainment',
      },
      {
        name: 'books-etc',
        defaultFactorValue: 1,
        group: 'entertainment',
      },
      {
        name: 'hobbies',
        defaultFactorValue: 1,
        group: 'entertainment',
      },
      {
        name: 'eating-out',
        defaultFactorValue: 1,
        group: 'entertainment',
      },
      {
        name: 'sport',
        defaultFactorValue: 1,
        group: 'entertainment',
      },
      {
        name: 'lottery',
        defaultFactorValue: getFactorValue('week'),
        group: 'entertainment',
      },
      {
        name: 'newspapers',
        defaultFactorValue: getFactorValue('week'),
        group: 'entertainment',
      },
      {
        name: 'birthdays',
        defaultFactorValue: getFactorValue('year'),
        group: 'one-offs',
      },
      {
        name: 'christmas',
        defaultFactorValue: getFactorValue('year'),
        group: 'one-offs',
      },
      {
        name: 'festivals-celebrations',
        defaultFactorValue: getFactorValue('year'),
        group: 'one-offs',
      },
      {
        name: 'weddings',
        defaultFactorValue: getFactorValue('year'),
        group: 'one-offs',
      },
      {
        name: 'holidays',
        defaultFactorValue: getFactorValue('year'),
        group: 'holidays',
      },
      {
        name: 'insurance',
        defaultFactorValue: getFactorValue('year'),
        group: 'holidays',
      },
      {
        name: 'spending-money',
        defaultFactorValue: getFactorValue('year'),
        group: 'holidays',
      },
      ...createAdditionalItems('leisure'),
    ],
  },
  {
    name: 'summary', // @note: This page has it's own route.
    nextTab: `/budget-planner/save`,
  },
  // below tab is related to the your scenario page
  //that is not part of the main flow or part of current implementation
  // {
  //   name: 'your-scenario', // @note: This page has it's own route.
  //   title: {
  //     en: 'Life event planner',
  //     cy: 'Cynllunydd senario',
  //   },
  // },
];

type Summary = Record<'positive' | 'neutral' | 'negative', { color: string }>;

export const summary: Summary = {
  positive: { color: 'text-gray-800' },
  neutral: { color: 'text-gray-800' },
  negative: { color: 'text-gray-800' },
};

export const createSpreadsheetAdditionalItems = (
  section: string,
  startIndex: number,
) => {
  const values = Array.from({ length: 5 }, (n, i) => {
    return {
      name: `${section}-additional-field-${i}`,
      index: startIndex + i,
    };
  });

  const titles = Array.from({ length: 5 }, (n, i) => {
    return {
      name: `${section}-additional-field-${i}-title`,
      index: startIndex + i,
    };
  });

  return values.concat(titles);
};

export const spreadsheet = [
  {
    name: { en: 'Income', cy: 'Incwm' },
    id: 'income',
    fields: [
      { name: 'pay', index: 9 },
      { name: 'self-employment', index: 10 },
      { name: 'statutory-pay-sick', index: 11 },
      { name: 'statutory-maternity-pay', index: 12 },
      { name: 'universal-credit', index: 14 },
      { name: 'child-benefit', index: 15 },
      { name: 'support', index: 16 },
      { name: 'jobseekers-allowance', index: 17 },
      { name: 'esa-or-incapacity-benefit', index: 18 },
      { name: 'independence-payment', index: 19 },
      { name: 'pension-credit', index: 20 },
      { name: 'attendance-allowance', index: 21 },
      { name: 'carers-allowance', index: 22 },
      { name: 'housing-benefit', index: 23 },
      { name: 'state-pension', index: 25 },
      { name: 'workplace-pension', index: 26 },
      { name: 'annuity', index: 27 },
      { name: 'drawdown', index: 28 },
      { name: 'savings-investments', index: 30 },
      { name: 'rent-or-board', index: 31 },
      { name: 'child-maintenance', index: 32 },
      { name: 'student-loans-and-grants', index: 33 },
      { name: 'other-financial-support', index: 34 },
      { name: 'gifts', index: 35 },
      ...createSpreadsheetAdditionalItems('income', 37),
    ],
  },
  {
    name: { en: 'Household bills', cy: "Biliau'r cartref" },
    id: 'household-bills',
    fields: [
      { name: 'mortgage', index: 9 },
      { name: 'rent', index: 10 },
      { name: 'endowment', index: 11 },
      { name: 'insurance', index: 12 },
      { name: 'ground-rent', index: 14 },
      { name: 'service-charge', index: 15 },
      { name: 'buildings-insurance', index: 17 },
      { name: 'contents-insurance', index: 18 },
      { name: 'council-tax', index: 20 },
      { name: 'gas', index: 21 },
      { name: 'electricity', index: 22 },
      { name: 'other-fuel', index: 23 },
      { name: 'water', index: 24 },
      { name: 'home-phone', index: 25 },
      { name: 'mobile', index: 26 },
      { name: 'tv-licence', index: 27 },
      { name: 'cabel-or-satellite-tv', index: 28 },
      { name: 'home-maintenance', index: 29 },
      { name: 'garden-maintenance', index: 30 },
      { name: 'appliance-rental', index: 31 },
      { name: 'boiler-cover', index: 32 },
      ...createSpreadsheetAdditionalItems('householdbills', 34),
    ],
  },
  {
    name: { en: 'Living costs', cy: 'Costau byw' },
    id: 'living-costs',
    fields: [
      { name: 'grocery-shopping', index: 9 },
      { name: 'takeaways', index: 10 },
      { name: 'alcohol-at-home', index: 11 },
      { name: 'smoking-and-vaping', index: 12 },
      { name: 'lunches-snacks', index: 14 },
      { name: 'takeaway-coffees', index: 15 },
      { name: 'union-professional-fees', index: 16 },
      { name: 'clothes', index: 18 },
      { name: 'shoes', index: 19 },
      { name: 'work-clothes', index: 20 },
      { name: 'childrens-clothes', index: 21 },
      { name: 'school-uniform', index: 22 },
      { name: 'laundry-and-dry-cleaning', index: 23 },
      { name: 'hairdressing', index: 25 },
      { name: 'beauty-treatments', index: 26 },
      { name: 'toiletries', index: 27 },
      { name: 'eye-care', index: 28 },
      { name: 'dental-care', index: 29 },
      { name: 'prescriptions-medicines', index: 30 },
      ...createSpreadsheetAdditionalItems('living-costs', 32),
    ],
  },
  {
    name: { en: 'Finance & insurance', cy: 'Cyllid ac Yswiriant' },
    id: 'finance-insurance',
    fields: [
      { name: 'life-insurance', index: 9 },
      { name: 'protection-insurance', index: 10 },
      { name: 'critical-illness-insurance', index: 11 },
      { name: 'health-insurance', index: 12 },
      { name: 'dental-insurance', index: 13 },
      { name: 'overdraft-charges-interest', index: 15 },
      { name: 'bank-account-fees', index: 16 },
      { name: 'penalties', index: 17 },
      { name: 'loan-repayments', index: 19 },
      { name: 'student-loan-repayments', index: 20 },
      { name: 'credit-card-repayments', index: 21 },
      { name: 'car-hire-payments', index: 22 },
      { name: 'buy-now-pay-later', index: 23 },
      { name: 'other-credit-repayments', index: 24 },
      { name: 'regular-saving', index: 26 },
      { name: 'lump-sum-savings', index: 27 },
      { name: 'payments-isas', index: 28 },
      { name: 'buying-shares', index: 29 },
      { name: 'private-pensions', index: 30 },
      { name: 'long-term-care', index: 32 },
      { name: 'funeral-plan', index: 33 },
      { name: 'financial-advice', index: 35 },
      ...createSpreadsheetAdditionalItems('finance-insurance', 37),
    ],
  },
  {
    name: { en: 'Family & friends', cy: 'Teulu a ffrindiau' },
    id: 'family-friends',
    fields: [
      { name: 'childcare', index: 9 },
      { name: 'nappies', index: 10 },
      { name: 'activities', index: 11 },
      { name: 'treats', index: 12 },
      { name: 'pocket-money', index: 13 },
      { name: 'babysitting', index: 14 },
      { name: 'maintenance', index: 15 },
      { name: 'school-fees', index: 17 },
      { name: 'school-trips', index: 18 },
      { name: 'school-dinners', index: 19 },
      { name: 'school-clubs', index: 20 },
      { name: 'support-student', index: 22 },
      { name: 'support-relatives', index: 24 },
      { name: 'pet-food', index: 26 },
      { name: 'vet-bills', index: 27 },
      { name: 'pet-insurance', index: 28 },
      { name: 'donations', index: 30 },
      { name: 'loan', index: 32 },
      ...createSpreadsheetAdditionalItems('family-friends', 34),
    ],
  },
  {
    name: { en: 'Travel', cy: 'Teithio' },
    id: 'travel',
    fields: [
      { name: 'petrol-diesel', index: 9 },
      { name: 'car-insurance', index: 10 },
      { name: 'breakdown-cover', index: 11 },
      { name: 'car-tax', index: 12 },
      { name: 'car-finance', index: 13 },
      { name: 'loan-insurance', index: 14 },
      { name: 'mot', index: 15 },
      { name: 'maintenance', index: 16 },
      { name: 'parking', index: 17 },
      { name: 'bus', index: 19 },
      { name: 'trains', index: 20 },
      { name: 'taxis', index: 21 },
      { name: 'air', index: 22 },
      ...createSpreadsheetAdditionalItems('travel', 24),
    ],
  },
  {
    name: { en: 'Leisure', cy: 'Hamdden' },
    id: 'leisure',
    fields: [
      { name: 'cinema-theatre-trips', index: 9 },
      { name: 'days-out', index: 10 },
      { name: 'books-etc', index: 11 },
      { name: 'hobbies', index: 12 },
      { name: 'eating-out', index: 13 },
      { name: 'sport', index: 14 },
      { name: 'lottery', index: 15 },
      { name: 'newspapers', index: 16 },
      { name: 'birthdays', index: 18 },
      { name: 'christmas', index: 19 },
      { name: 'festivals-celebrations', index: 20 },
      { name: 'weddings', index: 21 },
      { name: 'holidays', index: 23 },
      { name: 'insurance', index: 24 },
      { name: 'spending-money', index: 25 },
      ...createSpreadsheetAdditionalItems('leisure', 27),
    ],
  },

  {
    name: { en: 'Your scenario', cy: 'Cynllunydd senario' },
    id: 'your-scenario',
    fields: [
      { name: 'your-scenario-grocery-shopping', index: 21 },
      { name: 'your-scenario-gas', index: 22 },
      { name: 'your-scenario-electricity', index: 23 },
      { name: 'your-scenario-rent', index: 24 },
      { name: 'your-scenario-petrol-diesel', index: 25 },
      { name: 'your-scenario-utilities', index: 26 },
      { name: 'your-scenario-mortgage-repayment', index: 27 },
      { name: 'your-scenario-household-mortgage-insurance', index: 28 },
    ],
  },
];

export const recommendedReadingContent = [
  { name: 'take-control-of-your-spending', tags: ['neutral', 'negative'] },
  {
    name: 'save-money-on-your-household-bills',
    tags: ['positive', 'neutral', 'negative'],
  },
  {
    name: 'build-your-emergency-savings-buffer',
    tags: ['positive', 'neutral'],
  },
  { name: 'make-the-most-of-your-savings', tags: ['positive', 'neutral'] },
  { name: 'review-your-pension-savings', tags: ['positive'] },
  { name: 'maximise-your-income', tags: ['negative'] },
  { name: 'talk-to-your-creditor', tags: ['negative'] },
  { name: 'prioritise-repaying-your-debts', tags: ['negative'] },
];

export const otherToolsContent = [
  {
    name: 'benefits-calculator',
    image: { src: BenefitsCalculator },
    tags: ['neutral', 'negative'],
  },
  {
    name: 'savings-calculator',
    image: { src: SavingsCalculator },
    tags: ['positive', 'neutral'],
  },
  {
    name: 'bill-prioritiser',
    image: { src: GetHelpWithYourBills },
    tags: ['negative', 'positive'],
  },
  {
    name: 'debt-advice-locator',
    image: { src: DebtAdvice },
    tags: ['negative'],
  },
];

export const saveAndContinuePageContent = {
  action: '/api/save-and-return',
};

export const progressSavedPageContent = {
  resendEmailAction: '/save',
};

export default tabs;

export const resetDialogContent = {
  confirmAction: `${API_ENDPOINT}/reset`,
  cancelAction: `${API_ENDPOINT}/summary`,
};
