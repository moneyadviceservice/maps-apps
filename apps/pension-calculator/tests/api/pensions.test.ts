import type { NextApiRequest, NextApiResponse } from 'next';

import {
  parseJourneyApiRequest,
  rejectIfNotPost,
  sendJourneyError,
  sendJourneyResult,
} from 'lib/handleJourneyApiRequest';
import { handlePensionsAction } from 'lib/handlePensionsAction';
import { requireJourneyAccess } from 'lib/requireJourneyAccess';
import handler from 'pages/api/pensions';
import type { PensionsFlow, PensionStep } from 'types/pensions';
import { requestField } from 'utils/requestField';

jest.mock('lib/handleJourneyApiRequest', () => ({
  parseJourneyApiRequest: jest.fn(),
  rejectIfNotPost: jest.fn(),
  sendJourneyError: jest.fn(),
  sendJourneyResult: jest.fn(),
}));

jest.mock('lib/handlePensionsAction', () => ({
  handlePensionsAction: jest.fn(),
}));

jest.mock('lib/requireJourneyAccess', () => ({
  requireJourneyAccess: jest.fn(),
}));

jest.mock('utils/requestField', () => ({
  requestField: jest.fn(),
}));

describe('Pensions API Handler', () => {
  let mockReq: NextApiRequest;
  let mockRes: NextApiResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {
      /** Suppress console error output in tests */
    });

    mockReq = {} as unknown as NextApiRequest;
    mockRes = {} as unknown as NextApiResponse;

    (parseJourneyApiRequest as jest.Mock).mockReturnValue({
      body: { potName: 'My Pension' },
      jsonRequest: true,
      action: 'continue',
      language: 'en',
      sessionId: 'session-123',
    });
  });

  it('returns early if request method is rejected by rejectIfNotPost', async () => {
    (rejectIfNotPost as jest.Mock).mockReturnValue(true);

    await handler(mockReq, mockRes);

    expect(rejectIfNotPost).toHaveBeenCalledWith(mockReq, mockRes);
    expect(requireJourneyAccess).not.toHaveBeenCalled();
  });

  it('sends result with redirect path when journey access is restricted', async () => {
    (rejectIfNotPost as jest.Mock).mockReturnValue(false);
    (requireJourneyAccess as jest.Mock).mockResolvedValue({
      redirect: { destination: '/en/login' },
    });

    await handler(mockReq, mockRes);

    expect(requireJourneyAccess).toHaveBeenCalledWith({
      page: 'pots-of-money',
      language: 'en',
      sessionId: 'session-123',
    });
    expect(sendJourneyResult).toHaveBeenCalledWith(mockRes, true, {
      valid: false,
      redirectPath: '/en/login',
    });
    expect(handlePensionsAction).not.toHaveBeenCalled();
  });

  describe('Flow and Step Resolution', () => {
    const flowCases: Array<[string | undefined, PensionsFlow]> = [
      ['pots-of-money', 'pots-of-money'],
      ['income-pensions', 'income-pensions'],
      ['invalid-flow', 'pots-of-money'],
      [undefined, 'pots-of-money'],
    ];

    it.each(flowCases)(
      'resolves raw flow %s to %s',
      async (inputFlow, expectedFlow) => {
        (rejectIfNotPost as jest.Mock).mockReturnValue(false);
        (requireJourneyAccess as jest.Mock).mockResolvedValue({
          language: 'en',
          sessionId: 'session-123',
        });
        (requestField as jest.Mock).mockImplementation((_req, field) => {
          if (field === 'flow') return inputFlow;
          if (field === 'step') return 'screening';
          return undefined;
        });

        const mockActionResult = { valid: true, redirectPath: '/next' };
        (handlePensionsAction as jest.Mock).mockResolvedValue(mockActionResult);

        await handler(mockReq, mockRes);

        expect(requireJourneyAccess).toHaveBeenCalledWith({
          page: expectedFlow,
          language: 'en',
          sessionId: 'session-123',
        });
        expect(handlePensionsAction).toHaveBeenCalledWith(
          expect.objectContaining({ flow: expectedFlow }),
        );
      },
    );

    const stepCases: Array<[string | undefined, PensionStep]> = [
      ['details', 'details'],
      ['screening', 'screening'],
      ['invalid-step', 'screening'],
      [undefined, 'screening'],
    ];

    it.each(stepCases)(
      'calls handlePensionsAction with raw step %s resolved to %s',
      async (inputStep, expectedStep) => {
        (rejectIfNotPost as jest.Mock).mockReturnValue(false);
        (requireJourneyAccess as jest.Mock).mockResolvedValue({
          language: 'en',
          sessionId: 'session-123',
        });
        (requestField as jest.Mock).mockImplementation((_req, field) => {
          if (field === 'step') return inputStep;
          if (field === 'index') return '1';
          return undefined;
        });

        const mockActionResult = { valid: true, redirectPath: '/next-step' };
        (handlePensionsAction as jest.Mock).mockResolvedValue(mockActionResult);

        await handler(mockReq, mockRes);

        expect(handlePensionsAction).toHaveBeenCalledWith({
          action: 'continue',
          step: expectedStep,
          flow: 'pots-of-money',
          body: { potName: 'My Pension' },
          language: 'en',
          sessionId: 'session-123',
          removeIndex: 1,
        });
        expect(sendJourneyResult).toHaveBeenCalledWith(
          mockRes,
          true,
          mockActionResult,
        );
      },
    );
  });

  it('logs error and calls sendJourneyError when handlePensionsAction throws', async () => {
    (rejectIfNotPost as jest.Mock).mockReturnValue(false);
    (requireJourneyAccess as jest.Mock).mockResolvedValue({
      language: 'en',
      sessionId: 'session-123',
    });
    (requestField as jest.Mock).mockReturnValue('screening');

    const mockError = new Error('Database connection failed');
    (handlePensionsAction as jest.Mock).mockRejectedValue(mockError);

    await handler(mockReq, mockRes);

    expect(console.error).toHaveBeenCalledWith(
      'Failed to persist pension information',
      mockError,
    );
    expect(sendJourneyError).toHaveBeenCalledWith(
      mockRes,
      true,
      'Failed to persist pension information',
    );
  });
});
