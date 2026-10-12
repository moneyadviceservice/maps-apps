import { useRouter } from 'next/router';

import type { PensionStep } from 'lib/handlePensionsAction';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import {
  hasPensionErrors,
  validateContributions,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import type { PotsOfMoneyData, PotsOfMoneyErrors } from 'types/pensions';
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
  pensionsCopy: jest.fn().mockReturnValue({
    screeningHeading: 'Screening Heading',
    detailsHeading: 'Details Heading',
    contributionsHeading: 'Contributions Heading',
  }),
}));

jest.mock('data/journey', () => ({
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
  validateContributions: jest.fn(),
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
  const initialData: PotsOfMoneyData = {
    hasPotOfMoneyPension: 'yes',
    pots: [{ name: 'Pot 1', currentValue: '1000', taxFreeCash: '250' }],
  } as unknown as PotsOfMoneyData;

  const initialErrors: PotsOfMoneyErrors = {};

  const defaultProps = {
    step: 'screening' as PensionStep,
    sessionId: 'session-123',
    initialData,
    initialErrors,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (hasPensionErrors as unknown as jest.Mock).mockReturnValue(false);
    (persistJourneyJson as jest.Mock).mockResolvedValue({});
  });

  const stepHeadingCases: Array<[PensionStep, string]> = [
    ['screening', 'Screening Heading'],
    ['details', 'Details Heading'],
    ['contributions', 'Contributions Heading'],
  ];

  test.each(stepHeadingCases)(
    'initializes correct pageTitle and document.title for step: %s',
    (step, expectedHeading) => {
      const { result } = renderHook(() =>
        usePensionsForm({ ...defaultProps, step }),
      );

      expect(result.current.pageTitle).toBe(expectedHeading);
      expect(document.title).toBe(expectedHeading);
    },
  );

  test.each([
    ['screening', validatePotScreening],
    ['details', validatePotDetails],
    ['contributions', validateContributions],
  ])(
    'executes step validation and stops continue execution when errors exist on step: %s',
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
      expect(validationFn).toHaveBeenCalledWith(initialData);
      expect(result.current.errors).toBe(mockErrors);
      expect(result.current.hasErrors).toBe(true);
      expect(persistJourneyJson).not.toHaveBeenCalled();
    },
  );

  test.each([
    ['screening', 'no', '/en/income-pensions?session=session-123'],
    ['screening', 'yes', '/en/pots-of-money/details?session=session-123'],
    ['details', 'yes', '/en/pots-of-money/contributions?session=session-123'],
    ['contributions', 'yes', '/en/pots-of-money/summary?session=session-123'],
  ])(
    'persists and redirects to %s when step is %s and hasPotOfMoneyPension is %s',
    async (step, hasPension, expectedPath) => {
      const data = { ...initialData, hasPotOfMoneyPension: hasPension };
      (validatePotScreening as jest.Mock).mockReturnValue({});
      (validatePotDetails as jest.Mock).mockReturnValue({});
      (validateContributions as jest.Mock).mockReturnValue({});
      (hasPensionErrors as unknown as jest.Mock).mockReturnValue(false);

      const { result } = renderHook(() =>
        usePensionsForm({
          ...defaultProps,
          step: step as PensionStep,
          initialData: data as PotsOfMoneyData,
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
      initialData,
    );
    expect(journeyPath).toHaveBeenCalledWith('en', 'save', 'session-123');
    expect(mockPush).toHaveBeenCalled();
  });

  test('updates specific pot field via updatePot', () => {
    const { result } = renderHook(() => usePensionsForm(defaultProps));

    act(() => {
      result.current.updatePot(0, 'name', 'Updated Pension Name');
    });

    expect(result.current.data.pots[0].name).toBe('Updated Pension Name');
  });

  test('adds pot and sets focus on new pot input via handleAdd', async () => {
    const nextData = {
      ...initialData,
      pots: [
        initialData.pots[0],
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

    expect(addPot).toHaveBeenCalledWith(initialData);
    expect(result.current.data).toBe(nextData);
    expect(focusMock).toHaveBeenCalled();
    expect(persistJourneyJson).toHaveBeenCalledWith(
      `${PENSIONS_API}?step=screening`,
      'update',
      'en',
      'session-123',
      nextData,
    );
  });

  test('removes pot and updates errors via handleRemove', async () => {
    const multiPotData = {
      ...initialData,
      pots: [
        { name: 'Pot 1', currentValue: '100', taxFreeCash: '0' },
        { name: 'Pot 2', currentValue: '200', taxFreeCash: '0' },
      ],
    };

    const nextData = {
      ...initialData,
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
});
