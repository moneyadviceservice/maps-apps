import type { MouseEvent, SubmitEvent } from 'react';

import { MAX_OTHER_INCOME_ROWS } from 'types/income';
import {
  ADD_ANOTHER_INCOME_ID,
  GROSS_PAY_ID,
  otherIncomeNameId,
  otherIncomeRemoveId,
} from 'utils/incomeFieldIds';
import {
  emptyRows,
  incomeData,
  INVESTMENTS,
  mockIncomeFetch,
  mockPush,
  RENT,
  SAVINGS,
} from 'test-utils/yourIncomeFormTestUtils';
import { act, renderHook } from '@testing-library/react';

import { useYourIncomeForm } from './useYourIncomeForm';

const preventDefaultEvent = () => ({ preventDefault: jest.fn() });
const submitEvent =
  preventDefaultEvent() as unknown as SubmitEvent<HTMLFormElement>;
const clickEvent =
  preventDefaultEvent() as unknown as MouseEvent<HTMLButtonElement>;

const renderForm = (
  overrides?: Partial<Parameters<typeof useYourIncomeForm>[0]>,
) =>
  renderHook(() =>
    useYourIncomeForm({
      sessionId: 'abc',
      initialData: incomeData(),
      initialErrors: {},
      ...overrides,
    }),
  );

const spyFocus = () => {
  const focus = jest.fn();
  jest.spyOn(document, 'getElementById').mockReturnValue({
    focus,
  } as unknown as HTMLElement);
  return focus;
};

const call = async (action: () => Promise<unknown>) => {
  await act(async () => {
    await action();
  });
};

const persistUpdate = (action: string) => {
  expect(global.fetch).toHaveBeenCalledWith(
    `/api/your-income?action=${action}`,
    expect.objectContaining({ method: 'POST' }),
  );
};

describe('useYourIncomeForm', () => {
  beforeEach(() => {
    mockPush.mockReset();
    mockIncomeFetch();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sets errors on continue when gross pay is blank and does not persist', async () => {
    const { result } = renderForm();

    await call(() => result.current.handleContinue(submitEvent));

    expect(result.current.errors[GROSS_PAY_ID]).toEqual([
      'Enter details of your income to continue',
    ]);
    expect(result.current.hasErrors).toBe(true);
    expect(document.title).toBe('Error: Your income - Pension calculator');
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('persists continue and navigates when gross pay is valid', async () => {
    mockIncomeFetch({
      body: {
        success: true,
        redirectPath: '/en/pots-of-money?sessionId=abc',
      },
    });
    const { result } = renderForm();

    act(() => {
      result.current.onGrossPayChange('26900');
      result.current.onGrossPayFrequencyChange('month');
    });

    await call(() => result.current.handleContinue(submitEvent));

    persistUpdate('continue');
    expect(
      JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body),
    ).toEqual(
      expect.objectContaining({
        language: 'en',
        sessionId: 'abc',
        grossPay: '26900',
        grossPayFrequency: 'month',
      }),
    );
    expect(mockPush).toHaveBeenCalledWith('/en/pots-of-money?sessionId=abc');
  });

  it.each([
    ['continue', '/en/pots-of-money?sessionId=abc'],
    ['save', '/en/save?sessionId=abc'],
  ])(
    'falls back to %s when the API omits redirectPath',
    async (action, fallback) => {
      mockIncomeFetch({ body: { success: true } });
      const { result } = renderForm();

      act(() => {
        result.current.onGrossPayChange('26900');
      });

      await call(() =>
        action === 'continue'
          ? result.current.handleContinue(submitEvent)
          : result.current.handleSave(clickEvent),
      );

      expect(mockPush).toHaveBeenCalledWith(fallback);
    },
  );

  it.each(['continue', 'save'] as const)(
    'stays on the page when %s persistence fails',
    async (action) => {
      mockIncomeFetch({ ok: false, status: 500 });
      const { result } = renderForm();

      act(() => {
        result.current.onGrossPayChange('26900');
      });

      await call(() =>
        action === 'continue'
          ? result.current.handleContinue(submitEvent)
          : result.current.handleSave(clickEvent),
      );

      expect(mockPush).not.toHaveBeenCalled();
    },
  );

  it('updates gross pay frequency', () => {
    const { result } = renderForm();

    act(() => {
      result.current.onGrossPayFrequencyChange('month');
    });

    expect(result.current.data.grossPayFrequency).toBe('month');
  });

  it('persists save and navigates to the save journey', async () => {
    mockIncomeFetch({
      body: { success: true, redirectPath: '/en/save?sessionId=abc' },
    });
    const { result } = renderForm();

    await call(() => result.current.handleSave(clickEvent));

    persistUpdate('save');
    expect(mockPush).toHaveBeenCalledWith('/en/save?sessionId=abc');
  });

  it('adds a row, persists update, and focuses the new name field', async () => {
    const focus = spyFocus();
    const { result } = renderForm();

    act(() => {
      result.current.updateRow(0, 'name', 'Savings');
    });

    await call(() => result.current.handleAdd(clickEvent));

    expect(result.current.data.otherIncome).toHaveLength(2);
    expect(result.current.data.otherIncome[0].name).toBe('Savings');
    expect(result.current.showRemove).toBe(true);
    persistUpdate('update');
    expect(document.getElementById).toHaveBeenCalledWith(otherIncomeNameId(1));
    expect(focus).toHaveBeenCalled();

    act(() => {
      result.current.updateRow(0, 'amount', '10');
      result.current.updateRow(1, 'frequency', 'month');
    });

    expect(result.current.data.otherIncome[0].amount).toBe('10');
    expect(result.current.data.otherIncome[1].frequency).toBe('month');
  });

  it('keeps the new row when add persistence fails', async () => {
    mockIncomeFetch({ ok: false, status: 500 });
    const { result } = renderForm();

    await call(() => result.current.handleAdd(clickEvent));

    expect(result.current.data.otherIncome).toHaveLength(2);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not add beyond the maximum number of rows', async () => {
    const { result } = renderForm({
      initialData: incomeData({
        otherIncome: emptyRows(MAX_OTHER_INCOME_ROWS),
      }),
    });

    expect(result.current.showAdd).toBe(false);

    await call(() => result.current.handleAdd(clickEvent));

    expect(result.current.data.otherIncome).toHaveLength(MAX_OTHER_INCOME_ROWS);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('removes a row, reindexes errors, persists update, and moves focus', async () => {
    const focus = spyFocus();
    const { result } = renderForm({
      initialData: incomeData({
        otherIncome: [SAVINGS, INVESTMENTS, RENT],
      }),
      initialErrors: {
        'other-income-1-amount': ['Enter an amount for this income'],
      },
    });

    await call(() => result.current.handleRemove(clickEvent, 1));

    expect(result.current.data.otherIncome.map((row) => row.name)).toEqual([
      'Savings',
      'Rent',
    ]);
    expect(result.current.errors).toEqual({});
    persistUpdate('update');
    expect(document.getElementById).toHaveBeenCalledWith(
      otherIncomeRemoveId(1),
    );
    expect(focus).toHaveBeenCalled();
  });

  it.each([
    {
      rows: [SAVINGS, INVESTMENTS, RENT],
      removeIndex: 2,
      focusedId: otherIncomeRemoveId(1),
    },
    {
      rows: [SAVINGS, INVESTMENTS],
      removeIndex: 1,
      focusedId: ADD_ANOTHER_INCOME_ID,
    },
  ])(
    'moves focus to $focusedId after removing index $removeIndex',
    async ({ rows, removeIndex, focusedId }) => {
      spyFocus();
      const { result } = renderForm({
        initialData: incomeData({ otherIncome: rows }),
      });

      await call(() => result.current.handleRemove(clickEvent, removeIndex));

      expect(document.getElementById).toHaveBeenCalledWith(focusedId);
    },
  );

  it('keeps remaining rows when remove persistence fails', async () => {
    mockIncomeFetch({ ok: false, status: 500 });
    const { result } = renderForm({
      initialData: incomeData({ otherIncome: [SAVINGS, INVESTMENTS] }),
    });

    await call(() => result.current.handleRemove(clickEvent, 1));

    expect(result.current.data.otherIncome.map((row) => row.name)).toEqual([
      'Savings',
    ]);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('returns the expected heading and placeholder for one or many rows', () => {
    const single = renderForm();
    expect(single.result.current.otherIncomeHeading(0)).toBe('Other income');
    expect(single.result.current.namePlaceholder(0)).toBe(
      'For example, Savings',
    );

    const many = renderForm({
      initialData: incomeData({ otherIncome: emptyRows(2) }),
    });
    expect(many.result.current.otherIncomeHeading(0)).toBe('Other income 1');
    expect(many.result.current.namePlaceholder(1)).toBe(
      'For example, Investments',
    );
  });
});
