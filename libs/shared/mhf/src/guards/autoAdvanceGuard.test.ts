import { GetServerSidePropsContext } from 'next';

import { mockFlow, mockSessionId, mockSteps } from '../mocks';
import { ensureSessionAndStore } from '../store';
import { FlowConfig } from '../types';
import { createAutoAdvanceGuard } from './autoAdvanceGuard';

jest.mock('../store', () => ({
  ensureSessionAndStore: jest.fn().mockResolvedValue({
    key: mockSessionId,
    responseHeaders: {
      get: jest.fn().mockReturnValue('mock-cookie'),
    },
  }),
  getStoreEntry: jest.fn().mockResolvedValue({
    data: { locale: 'en' },
  }),
}));

describe('autoAdvanceGuard', () => {
  const flowConfig: FlowConfig = new Map();
  const autoAdvanceGuard = createAutoAdvanceGuard(flowConfig);

  const res = {
    setHeader: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  };

  const req = {};

  beforeEach(() => {
    jest.clearAllMocks();
    flowConfig.clear();
  });

  it('handles array aa query param', async () => {
    flowConfig.set(mockFlow, {
      autoAdvanceStep: mockSteps[0],
    });
    await autoAdvanceGuard({
      query: { aa: [mockFlow] },
      res,
      req,
      params: { language: ['en'] },
    } as unknown as GetServerSidePropsContext);

    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: `/en/${mockSteps[0]}`,
    });
    expect(res.end).toHaveBeenCalled();
  });

  it('does nothing if aa query param is missing', async () => {
    await autoAdvanceGuard({
      query: {},
      res,
      req,
    } as unknown as GetServerSidePropsContext);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.writeHead).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });

  it('does nothing if flow does not have autoAdvanceStep', async () => {
    flowConfig.set('flow-without-auto-advance', {});
    await autoAdvanceGuard({
      query: { aa: 'flow-without-auto-advance' },
      res,
      req,
    } as unknown as GetServerSidePropsContext);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.writeHead).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });

  it('defaults to "en" if params.language is missing', async () => {
    flowConfig.set(mockFlow, {
      autoAdvanceStep: mockSteps[0],
    });
    await autoAdvanceGuard({
      query: { aa: mockFlow },
      res,
      req,
    } as unknown as GetServerSidePropsContext);

    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: `/en/${mockSteps[0]}`,
    });
    expect(res.end).toHaveBeenCalled();
  });

  it('defaults to "en" for an unsupported route language', async () => {
    flowConfig.set(mockFlow, {
      autoAdvanceStep: mockSteps[0],
    });

    await autoAdvanceGuard({
      query: { aa: mockFlow },
      res,
      req,
      params: { language: 'fr' },
    } as unknown as GetServerSidePropsContext);

    expect(ensureSessionAndStore).toHaveBeenCalledWith(
      req,
      mockSteps[0],
      true,
      mockFlow,
      'en',
    );
    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: `/en/${mockSteps[0]}`,
    });
  });

  it('does not set cookie header if responseHeaders.get returns null', async () => {
    (ensureSessionAndStore as jest.Mock).mockResolvedValueOnce({
      key: mockSessionId,
      responseHeaders: {
        get: jest.fn().mockReturnValue(null),
      },
    });

    flowConfig.set(mockFlow, {
      autoAdvanceStep: mockSteps[0],
    });
    await autoAdvanceGuard({
      query: { aa: mockFlow },
      res,
      req,
      params: { language: 'en' },
    } as unknown as GetServerSidePropsContext);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: `/en/${mockSteps[0]}`,
    });
    expect(res.end).toHaveBeenCalled();
  });

  it('strips aa and preserves remaining query params', async () => {
    flowConfig.set(mockFlow, {
      autoAdvanceStep: mockSteps[0],
    });

    await autoAdvanceGuard({
      query: {
        aa: mockFlow,
        sessionID: mockSessionId,
        source: 'mappedStep',
      },
      resolvedUrl: `/en?aa=${mockFlow}&sessionID=${mockSessionId}&source=mappedStep`,
      res,
      req,
      params: { language: 'en' },
    } as unknown as GetServerSidePropsContext);

    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: `/en/${mockSteps[0]}?sessionID=${mockSessionId}&source=mappedStep`,
    });
    expect(res.end).toHaveBeenCalled();
  });
});
