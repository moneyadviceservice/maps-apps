import { useRouter } from 'next/router';

import { persistJourneyJson } from 'lib/persistJourneyJson';
import {
  hasPensionErrors,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import type {
  DefinedIncomeData,
  PensionsFlow,
  PensionStep,
  PotsOfMoneyData,
  PotsOfMoneyErrors,
} from 'types/pensions';
import { addPot, errorsAfterRemovingPot, removePot } from 'utils/dcPotRows';
import { journeyPath } from 'utils/journeyPath';
import { act, renderHook } from '@testing-library/react';

import { PENSIONS_API, usePensionsForm } from './usePensionsForm';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@maps-react/hooks/useLanguage', () => ({
  useContextLanguage: jest.fn().mockReturnValue('en'),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({ z: jest.fn() }),
}));

jest.mock('data/pensions', () => ({
  pensionPotsCopy: jest.fn().mockReturnValue({
    screeningHeading: 'Pots Screening Heading',
    detailsHeading: 'Pots Details Heading',
    contributionsHeading: 'Pots Contributions Heading',
  }),
  incomePensionsCopy: jest.fn().mockReturnValue({
    screeningHeading: 'Income Screening Heading',
    detailsHeading: 'Income Details Heading',
    contributionsHeading: 'Income Contributions Heading',
  }),
}));

jest.mock('data/journey', () => ({
  JOURNEY_PAGES: {
    STATE_PENSION: 'state-pension',
    INCOME_DETAILS: 'income-pensions/details',
    INCOME_SUMMARY: 'income-pensions/summary',
  },
  journeyCopy: jest.fn().mockReturnValue({
    continue: 'Continue',
    saveAndComeBack: 'Save and come back',
  }),
}));

jest.mock('data/pageTitle', () => ({
  pensionCalculatorPageTitle: jest.fn(
    (heading: string, _z: unknown, hasErrors: boolean) =>
      `${heading}${hasErrors ? ' - Error' : ''}`,
  ),
}));

jest.mock('lib/persistJourneyJson', () => ({
  persistJourneyJson: jest.fn(),
}));

jest.mock('lib/validation/pensions', () => ({
  hasPensionErrors: jest.fn(),
  validatePotScreening: jest.fn(),
  validatePotDetails: jest.fn(),
}));

jest.mock('utils/dcPotRows', () => ({
  addPot: jest.fn(),
  removePot: jest.fn(),
  errorsAfterRemovingPot: jest.fn(),
}));

jest.mock('utils/journeyPath', () => ({
  journeyPath: jest.fn(
    (lang: string, path: string, sessionId: string) =>
      `/${lang}/${path}?session=${sessionId}`,
  ),
}));

jest.mock('utils/pensionFieldIds', () => ({
  ADD_PENSION_ID: 'add-pension-id',
  potNameId: (i: number) => `pot-name-${i}`,
  potRemoveId: (i: number) => `pot-remove-${i}`,
}));

describe('usePensionsForm Hook', () => {
  const mockPush = jest.fn();
  const potsInitialData: PotsOfMoneyData = {
    hasPotOfMoneyPension: 'yes',
    pots: [{ name: 'Pot 1', currentValue: '1000', taxFreeCash: '250' }],
  } as unknown as PotsOfMoneyData;

  const incomeInitialData: DefinedIncomeData = {
    hasIncomePension: 'yes',
  } as unknown as DefinedIncomeData;

  const initialErrors: PotsOfMoneyErrors = {};

  const defaultProps = {
    step: 'screening' as PensionStep,
    flow: 'pots-of-money' as PensionsFlow,
    sessionId: 'session-123',
    initialData: potsInitialData,
    initialErrors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (hasPensionErrors as unknown as jest.Mock).mockReturnValue(false);
    (persistJourneyJson as jest.Mock).mockResolvedValue({});
  });

  describe('Page Titles & Headings', () => {
    test.each<[PensionsFlow, PensionStep, string]>([
      ['pots-of-money', 'screening', 'Pots Screening Heading'],
      ['pots-of-money', 'details', 'Pots Details Heading'],
      ['pots-of-money', 'contributions', 'Pots Contributions Heading'],
      ['income-pensions', 'screening', 'Income Screening Heading'],
      ['income-pensions', 'details', 'Income Details Heading'],
      ['income-pensions', 'contributions', 'Income Contributions Heading'],
    ])(
      'initializes correct heading for flow: %s and step: %s',
      (flow, step, expectedHeading) => {
        const { result } = renderHook(() =>
          usePensionsForm({
            ...defaultProps,
            flow,
            step,
            initialData:
              flow === 'pots-of-money' ? potsInitialData : incomeInitialData,
          }),
        );

        expect(result.current.pageTitle).toBe(expectedHeading);
        expect(document.title).toBe(expectedHeading);
      },
    );
  });

  describe('Validation & Submission', () => {
    test.each([
      ['screening', validatePotScreening],
      ['details', validatePotDetails],
    ])(
      'executes step validation and stops continue execution when errors exist on pots-of-money step: %s',
      async (step, validationFn) => {
        const mockErrors = { field: ['Error message'] };
        (validationFn as jest.Mock).mockReturnValue(mockErrors);
        (hasPensionErrors as unknown as jest.Mock).mockReturnValue(true);

        const { result } = renderHook(() =>
          usePensionsForm({ ...defaultProps, step: step as PensionStep }),
        );

        const mockEvent = { preventDefault: jest.fn() };
        await act(async () => {
          await result.current.handleContinue(
            mockEvent as unknown as React.SubmitEvent<HTMLFormElement>,
          );
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(validationFn).toHaveBeenCalledWith(potsInitialData);
        expect(result.current.errors).toBe(mockErrors);
        expect(result.current.hasErrors).toBe(true);
        expect(persistJourneyJson).not.toHaveBeenCalled();
      },
    );
  });

  describe('Navigation & Persistence', () => {
    test.each([
      [
        'pots-of-money',
        'screening',
        { hasPotOfMoneyPension: 'no' },
        '/en/income-pensions?session=session-123',
      ],
      [
        'pots-of-money',
        'screening',
        { hasPotOfMoneyPension: 'yes' },
        '/en/pots-of-money/details?session=session-123',
      ],
      [
        'pots-of-money',
        'details',
        { hasPotOfMoneyPension: 'yes' },
        '/en/pots-of-money/contributions?session=session-123',
      ],
      [
        'pots-of-money',
        'contributions',
        { hasPotOfMoneyPension: 'yes' },
        '/en/pots-of-money/summary?session=session-123',
      ],
      [
        'income-pensions',
        'screening',
        { hasIncomePension: 'no' },
        '/en/state-pension?session=session-123',
      ],
      [
        'income-pensions',
        'screening',
        { hasIncomePension: 'yes' },
        '/en/income-pensions/details?session=session-123',
      ],
      [
        'income-pensions',
        'details',
        { hasIncomePension: 'yes' },
        '/en/income-pensions/summary?session=session-123',
      ],
    ])(
      'persists and redirects correctly for flow %s step %s',
      async (flow, step, dataOverrides, expectedPath) => {
        const data = {
          ...(flow === 'pots-of-money' ? potsInitialData : incomeInitialData),
          ...dataOverrides,
        } as PotsOfMoneyData | DefinedIncomeData;
        (validatePotScreening as jest.Mock).mockReturnValue({});
        (validatePotDetails as jest.Mock).mockReturnValue({});
        (hasPensionErrors as unknown as jest.Mock).mockReturnValue(false);

        const { result } = renderHook(() =>
          usePensionsForm({
            ...defaultProps,
            flow: flow as PensionsFlow,
            step: step as PensionStep,
            initialData: data,
          }),
        );

        const mockEvent = { preventDefault: jest.fn() };
        await act(async () => {
          await result.current.handleContinue(
            mockEvent as unknown as React.SubmitEvent<HTMLFormElement>,
          );
        });

        expect(persistJourneyJson).toHaveBeenCalledWith(
          `${PENSIONS_API}?step=${step}`,
          'continue',
          'en',
          'session-123',
          data,
          flow,
        );
        expect(mockPush).toHaveBeenCalledWith(expectedPath);
      },
    );

    test('handles save action correctly', async () => {
      const { result } = renderHook(() => usePensionsForm(defaultProps));

      const mockEvent = { preventDefault: jest.fn() };
      await act(async () => {
        await result.current.handleSave(
          mockEvent as unknown as React.MouseEvent<HTMLButtonElement>,
        );
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(persistJourneyJson).toHaveBeenCalledWith(
        `${PENSIONS_API}?step=screening`,
        'save',
        'en',
        'session-123',
        potsInitialData,
        'pots-of-money',
      );
      expect(journeyPath).toHaveBeenCalledWith('en', 'save', 'session-123');
      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('Pot Handlers', () => {
    test('updates specific pot field via updatePot when in pots-of-money flow', () => {
      const { result } = renderHook(() => usePensionsForm(defaultProps));

      act(() => {
        result.current.updatePot(0, 'name', 'Updated Pension Name');
      });

      expect((result.current.data as PotsOfMoneyData).pots[0].name).toBe(
        'Updated Pension Name',
      );
    });

    test('does not update pot field when in income-pensions flow', () => {
      const { result } = renderHook(() =>
        usePensionsForm({
          ...defaultProps,
          flow: 'income-pensions',
          initialData: incomeInitialData,
        }),
      );

      act(() => {
        result.current.updatePot(0, 'name', 'Updated Pension Name');
      });

      expect(result.current.data).toEqual(incomeInitialData);
    });

    test('adds pot and sets focus on new pot input via handleAdd', async () => {
      const nextData = {
        ...potsInitialData,
        pots: [
          potsInitialData.pots[0],
          { name: '', currentValue: '', taxFreeCash: '' },
        ],
      };
      (addPot as jest.Mock).mockReturnValue(nextData);

      const focusMock = jest.fn();
      jest
        .spyOn(document, 'getElementById')
        .mockReturnValue({ focus: focusMock } as unknown as HTMLElement);

      const { result } = renderHook(() => usePensionsForm(defaultProps));

      const mockEvent = { preventDefault: jest.fn() };
      await act(async () => {
        await result.current.handleAdd(
          mockEvent as unknown as React.MouseEvent<HTMLButtonElement>,
        );
      });

      expect(addPot).toHaveBeenCalledWith(potsInitialData);
      expect(result.current.data).toBe(nextData);
      expect(focusMock).toHaveBeenCalled();
      expect(persistJourneyJson).toHaveBeenCalledWith(
        `${PENSIONS_API}?step=screening`,
        'update',
        'en',
        'session-123',
        nextData,
        'pots-of-money',
      );
    });

    test('ignores handleAdd when in income-pensions flow', async () => {
      const { result } = renderHook(() =>
        usePensionsForm({
          ...defaultProps,
          flow: 'income-pensions',
          initialData: incomeInitialData,
        }),
      );

      const mockEvent = { preventDefault: jest.fn() };
      await act(async () => {
        await result.current.handleAdd(
          mockEvent as unknown as React.MouseEvent<HTMLButtonElement>,
        );
      });

      expect(addPot).not.toHaveBeenCalled();
      expect(persistJourneyJson).not.toHaveBeenCalled();
    });

    test('removes pot and updates errors via handleRemove', async () => {
      const multiPotData = {
        ...potsInitialData,
        pots: [
          { name: 'Pot 1', currentValue: '100', taxFreeCash: '0' },
          { name: 'Pot 2', currentValue: '200', taxFreeCash: '0' },
        ],
      };

      const nextData = {
        ...potsInitialData,
        pots: [{ name: 'Pot 1', currentValue: '100', taxFreeCash: '0' }],
      };

      (removePot as jest.Mock).mockReturnValue(nextData);
      (errorsAfterRemovingPot as jest.Mock).mockReturnValue({});

      const { result } = renderHook(() =>
        usePensionsForm({
          ...defaultProps,
          initialData: multiPotData as PotsOfMoneyData,
        }),
      );

      const mockEvent = { preventDefault: jest.fn() };
      await act(async () => {
        await result.current.handleRemove(
          mockEvent as unknown as React.MouseEvent<HTMLButtonElement>,
          1,
        );
      });

      expect(removePot).toHaveBeenCalledWith(multiPotData, 1);
      expect(errorsAfterRemovingPot).toHaveBeenCalledWith(initialErrors, 1);
      expect(result.current.data).toBe(nextData);
    });

    test('ignores handleRemove when in income-pensions flow', async () => {
      const { result } = renderHook(() =>
        usePensionsForm({
          ...defaultProps,
          flow: 'income-pensions',
          initialData: incomeInitialData,
        }),
      );

      const mockEvent = { preventDefault: jest.fn() };
      await act(async () => {
        await result.current.handleRemove(
          mockEvent as unknown as React.MouseEvent<HTMLButtonElement>,
          0,
        );
      });

      expect(removePot).not.toHaveBeenCalled();
      expect(persistJourneyJson).not.toHaveBeenCalled();
    });
  });
});
