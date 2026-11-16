import {
  defaultYourIncomeData,
  emptyOtherIncomeRow,
  type OtherIncomeRow,
  type YourIncomeData,
} from 'types/income';

export const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: {},
    pathname: '/en/your-income',
  }),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: () => 'en',
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: ({ en }: { en: string; cy: string }) => en,
  }),
}));

export const SAVINGS: OtherIncomeRow = {
  name: 'Savings',
  amount: '10',
  frequency: 'year',
};
export const INVESTMENTS: OtherIncomeRow = {
  name: 'Investments',
  amount: '20',
  frequency: 'year',
};
export const RENT: OtherIncomeRow = {
  name: 'Rent',
  amount: '30',
  frequency: 'year',
};

export const incomeData = (
  overrides: Partial<YourIncomeData> = {},
): YourIncomeData => ({
  ...defaultYourIncomeData(),
  ...overrides,
});

export const emptyRows = (count: number) =>
  Array.from({ length: count }, () => emptyOtherIncomeRow());

export const mockIncomeFetch = ({
  ok = true,
  status = 200,
  body = { success: true, redirectPath: '/en/save?sessionId=abc' },
}: {
  ok?: boolean;
  status?: number;
  body?: Record<string, unknown>;
} = {}) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  }) as jest.Mock;
};
