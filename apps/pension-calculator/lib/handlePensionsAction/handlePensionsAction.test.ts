import {
  saveIncomePensionsToSession,
  savePensionsToSession,
} from 'lib/session/pensionsSession';
import {
  hasPensionErrors,
  validateIncomeScreening,
  validatePotDetails,
  validatePotScreening,
} from 'lib/validation/pensions';
import { addPot, removePot } from 'utils/dcPotRows';
import {
  parseIncomePensionForm,
  parsePensionPotsForm,
} from 'utils/parsePensionsForm';

import { handlePensionsAction } from './handlePensionsAction';

jest.mock('data/journey', () => ({
  JOURNEY_PAGES: {
    POTS_OF_MONEY: 'pots-of-money',
    POT_DETAILS: 'pots-of-money/details',
    POT_CONTRIBUTIONS: 'pots-of-money/contributions',
    POT_SUMMARY: 'pots-of-money/summary',
    INCOME_PENSIONS: 'income-pensions',
    INCOME_DETAILS: 'income-pensions/details',
    INCOME_SUMMARY: 'income-pensions/summary',
    STATE_PENSION: 'state-pension',
    SAVE: 'save',
  },
}));

jest.mock('lib/session/pensionsSession', () => ({
  savePensionsToSession: jest.fn().mockResolvedValue(undefined),
  saveIncomePensionsToSession: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('lib/validation/pensions', () => ({
  hasPensionErrors: jest.fn(),
  validatePotScreening: jest.fn(),
  validatePotDetails: jest.fn(),
  validateIncomeScreening: jest.fn(),
}));

jest.mock('utils/dcPotRows', () => ({
  addPot: jest.fn(),
  removePot: jest.fn(),
}));

jest.mock('utils/parsePensionsForm', () => ({
  parsePensionPotsForm: jest.fn(),
  parseIncomePensionForm: jest.fn(),
}));

jest.mock('utils/journeyPath', () => ({
  journeyPath: jest.fn(
    (
      lang: string,
      path: string,
      sessionId: string,
      params?: Record<string, string>,
    ) => {
      const query = new URLSearchParams({ sessionId, ...params }).toString();
      return `/${lang}/${path}?${query}`;
    },
  ),
}));

jest.mock('utils/pensionFieldIds', () => ({
  potNameId: (i: number) => `pension-pot-${i}-name`,
}));

describe('handlePensionsAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (hasPensionErrors as unknown as jest.Mock).mockReturnValue(false);
    (validatePotScreening as jest.Mock).mockReturnValue({});
    (validatePotDetails as jest.Mock).mockReturnValue({});
    (validateIncomeScreening as jest.Mock).mockReturnValue({});
  });

  describe('Pots of Money Flow', () => {
    const potsRequest = (overrides: Record<string, unknown> = {}) => ({
      hasPotOfMoneyPension: 'yes',
      potCount: '1',
      'pension-pot-0-currentValue': '26900',
      ...overrides,
    });

    const parsedPotsData = {
      hasPotOfMoneyPension: 'yes',
      pots: [{ name: 'Pot 1', currentValue: '26900', taxFreeCash: '0' }],
    };

    beforeEach(() => {
      (parsePensionPotsForm as jest.Mock).mockImplementation((body) => ({
        hasPotOfMoneyPension: body.hasPotOfMoneyPension ?? 'yes',
        pots: [
          {
            name: 'Pot 1',
            currentValue: body['pension-pot-0-currentValue'] ?? '26900',
          },
        ],
      }));
    });

    it('redirects to income pensions when user selects no in screening', async () => {
      const result = await handlePensionsAction({
        action: 'continue',
        step: 'screening',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        body: potsRequest({ hasPotOfMoneyPension: 'no' }),
      });

      expect(result.valid).toBe(true);
      expect(result.redirectPath).toBe('/en/income-pensions?sessionId=abc');
      expect(savePensionsToSession).toHaveBeenCalledWith(
        'abc',
        expect.anything(),
      );
    });

    it('redirects to pot details when user selects yes in screening', async () => {
      const result = await handlePensionsAction({
        action: 'continue',
        step: 'screening',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        body: potsRequest(),
      });

      expect(result.valid).toBe(true);
      expect(result.redirectPath).toBe(
        '/en/pots-of-money/details?sessionId=abc',
      );
    });

    it('adds a pot and directs focus to its name field', async () => {
      const updatedPotsData = {
        ...parsedPotsData,
        pots: [parsedPotsData.pots[0], { name: '', currentValue: '' }],
      };
      (addPot as jest.Mock).mockReturnValue(updatedPotsData);

      const result = await handlePensionsAction({
        action: 'add',
        step: 'details',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        body: potsRequest(),
      });

      expect(addPot).toHaveBeenCalled();
      expect(result.data).toEqual(updatedPotsData);
      expect(result.redirectPath).toContain('#pension-pot-1-name');
    });

    it('removes a pot when action is remove', async () => {
      const reducedPotsData = { ...parsedPotsData, pots: [] };
      (removePot as jest.Mock).mockReturnValue(reducedPotsData);

      const result = await handlePensionsAction({
        action: 'remove',
        step: 'details',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        removeIndex: 0,
        body: potsRequest(),
      });

      expect(removePot).toHaveBeenCalledWith(expect.anything(), 0);
      expect(result.data).toEqual(reducedPotsData);
    });

    it('returns validation errors and appends error query param when validation fails', async () => {
      const mockErrors = { 'pension-pot-0-currentValue': ['Required'] };
      (validatePotDetails as jest.Mock).mockReturnValue(mockErrors);
      (hasPensionErrors as unknown as jest.Mock).mockReturnValue(true);

      const result = await handlePensionsAction({
        action: 'continue',
        step: 'details',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        body: potsRequest({ 'pension-pot-0-currentValue': '' }),
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toBe(mockErrors);
      expect(result.redirectPath).toContain(
        '/en/pots-of-money/details?sessionId=abc&error=true',
      );
    });

    it('advances valid contributions to summary route', async () => {
      const result = await handlePensionsAction({
        action: 'continue',
        step: 'contributions',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        body: potsRequest(),
      });

      expect(result.valid).toBe(true);
      expect(result.redirectPath).toBe(
        '/en/pots-of-money/summary?sessionId=abc',
      );
    });

    it('redirects to save page when action is save', async () => {
      const result = await handlePensionsAction({
        action: 'save',
        step: 'details',
        flow: 'pots-of-money',
        language: 'en',
        sessionId: 'abc',
        body: potsRequest(),
      });

      expect(result.redirectPath).toBe('/en/save?sessionId=abc');
    });
  });

  describe('Income Pensions Flow', () => {
    const incomeRequest = (overrides: Record<string, unknown> = {}) => ({
      hasIncomePension: 'yes',
      ...overrides,
    });

    beforeEach(() => {
      (parseIncomePensionForm as jest.Mock).mockImplementation((body) => ({
        hasIncomePension: body.hasIncomePension ?? 'yes',
      }));
    });

    it('redirects to state pension route when screening option is no', async () => {
      const result = await handlePensionsAction({
        action: 'continue',
        step: 'screening',
        flow: 'income-pensions',
        language: 'en',
        sessionId: 'abc',
        body: incomeRequest({ hasIncomePension: 'no' }),
      });

      expect(result.valid).toBe(true);
      expect(result.redirectPath).toBe('/en/state-pension?sessionId=abc');
      expect(saveIncomePensionsToSession).toHaveBeenCalledWith(
        'abc',
        expect.anything(),
      );
    });

    it('redirects to income details when screening option is yes', async () => {
      const result = await handlePensionsAction({
        action: 'continue',
        step: 'screening',
        flow: 'income-pensions',
        language: 'en',
        sessionId: 'abc',
        body: incomeRequest(),
      });

      expect(result.valid).toBe(true);
      expect(result.redirectPath).toBe(
        '/en/income-pensions/details?sessionId=abc',
      );
    });

    it('advances details step to income summary route', async () => {
      const result = await handlePensionsAction({
        action: 'continue',
        step: 'details',
        flow: 'income-pensions',
        language: 'en',
        sessionId: 'abc',
        body: incomeRequest(),
      });

      expect(result.valid).toBe(true);
      expect(result.redirectPath).toBe(
        '/en/income-pensions/summary?sessionId=abc',
      );
    });

    it('handles validation error redirect correctly for income flow', async () => {
      const mockErrors = { hasIncomePension: ['Select an option'] };
      (validateIncomeScreening as jest.Mock).mockReturnValue(mockErrors);
      (hasPensionErrors as unknown as jest.Mock).mockReturnValue(true);

      const result = await handlePensionsAction({
        action: 'continue',
        step: 'screening',
        flow: 'income-pensions',
        language: 'en',
        sessionId: 'abc',
        body: incomeRequest({ hasIncomePension: undefined }),
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toBe(mockErrors);
      expect(result.redirectPath).toContain(
        '/en/income-pensions?sessionId=abc&error=true',
      );
    });
  });
});
