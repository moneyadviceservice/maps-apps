import {
  getJourneySession,
  updateJourneySession,
} from 'lib/session/journeySession';
import type { DefinedIncomeData, PotsOfMoneyData } from 'types/pensions';
import {
  ensureIncomePensionsDefaults,
  ensurePensionsDefaults,
} from 'utils/parsePensionsForm';

import {
  getIncomePensionsFromSession,
  getPensionsFromSession,
  saveIncomePensionsToSession,
  savePensionsToSession,
} from './pensionsSession';

jest.mock('lib/session/journeySession', () => ({
  getJourneySession: jest.fn(),
  updateJourneySession: jest.fn(),
}));

jest.mock('utils/parsePensionsForm', () => ({
  ensurePensionsDefaults: jest.fn(),
  ensureIncomePensionsDefaults: jest.fn(),
}));

const mockedGetJourneySession = getJourneySession as jest.MockedFunction<
  typeof getJourneySession
>;
const mockedUpdateJourneySession = updateJourneySession as jest.MockedFunction<
  typeof updateJourneySession
>;
const mockedEnsurePensionsDefaults =
  ensurePensionsDefaults as jest.MockedFunction<typeof ensurePensionsDefaults>;
const mockedEnsureIncomePensionsDefaults =
  ensureIncomePensionsDefaults as jest.MockedFunction<
    typeof ensureIncomePensionsDefaults
  >;

const TEST_SESSION_ID = 'test-session-123';

const mockRawPotsData = {
  hasPotOfMoneyPension: 'yes',
} as PotsOfMoneyData;

const mockDefaultedPotsData = {
  hasPotOfMoneyPension: 'yes',
  pots: [{ name: 'Pot 1', currentValue: '1000', taxFreeCash: '0' }],
} as PotsOfMoneyData;

const mockRawIncomeData = {
  hasIncomePension: 'yes',
} as DefinedIncomeData;

const mockDefaultedIncomeData = {
  hasIncomePension: 'yes',
} as DefinedIncomeData;

describe('pensionsSession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPensionsFromSession', () => {
    it('returns defaulted pension pots data when potsOfMoney exists in session', async () => {
      mockedGetJourneySession.mockResolvedValue({
        potsOfMoney: mockRawPotsData,
      } as ReturnType<typeof getJourneySession> extends Promise<infer T> ? T : never);
      mockedEnsurePensionsDefaults.mockReturnValue(mockDefaultedPotsData);

      const result = await getPensionsFromSession(TEST_SESSION_ID);

      expect(mockedGetJourneySession).toHaveBeenCalledWith(TEST_SESSION_ID);
      expect(mockedEnsurePensionsDefaults).toHaveBeenCalledWith(
        mockRawPotsData,
      );
      expect(result).toEqual(mockDefaultedPotsData);
    });

    it('returns null when potsOfMoney is not present in session', async () => {
      mockedGetJourneySession.mockResolvedValue({
        potsOfMoney: undefined,
      } as ReturnType<typeof getJourneySession> extends Promise<infer T> ? T : never);

      const result = await getPensionsFromSession(TEST_SESSION_ID);

      expect(mockedGetJourneySession).toHaveBeenCalledWith(TEST_SESSION_ID);
      expect(mockedEnsurePensionsDefaults).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('getIncomePensionsFromSession', () => {
    it('returns defaulted income pensions data when incomePensions exists in session', async () => {
      mockedGetJourneySession.mockResolvedValue({
        incomePensions: mockRawIncomeData,
      } as ReturnType<typeof getJourneySession> extends Promise<infer T> ? T : never);
      mockedEnsureIncomePensionsDefaults.mockReturnValue(
        mockDefaultedIncomeData,
      );

      const result = await getIncomePensionsFromSession(TEST_SESSION_ID);

      expect(mockedGetJourneySession).toHaveBeenCalledWith(TEST_SESSION_ID);
      expect(mockedEnsureIncomePensionsDefaults).toHaveBeenCalledWith(
        mockRawIncomeData,
      );
      expect(result).toEqual(mockDefaultedIncomeData);
    });

    it('returns null when incomePensions is not present in session', async () => {
      mockedGetJourneySession.mockResolvedValue({
        incomePensions: undefined,
      } as ReturnType<typeof getJourneySession> extends Promise<infer T> ? T : never);

      const result = await getIncomePensionsFromSession(TEST_SESSION_ID);

      expect(mockedGetJourneySession).toHaveBeenCalledWith(TEST_SESSION_ID);
      expect(mockedEnsureIncomePensionsDefaults).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('savePensionsToSession', () => {
    it('updates journey session with potsOfMoney payload', async () => {
      mockedUpdateJourneySession.mockResolvedValue(undefined as never);

      await savePensionsToSession(TEST_SESSION_ID, mockDefaultedPotsData);

      expect(mockedUpdateJourneySession).toHaveBeenCalledWith(TEST_SESSION_ID, {
        potsOfMoney: mockDefaultedPotsData,
      });
    });
  });

  describe('saveIncomePensionsToSession', () => {
    it('updates journey session with incomePensions payload', async () => {
      mockedUpdateJourneySession.mockResolvedValue(undefined as never);

      await saveIncomePensionsToSession(
        TEST_SESSION_ID,
        mockDefaultedIncomeData,
      );

      expect(mockedUpdateJourneySession).toHaveBeenCalledWith(TEST_SESSION_ID, {
        incomePensions: mockDefaultedIncomeData,
      });
    });
  });
});
