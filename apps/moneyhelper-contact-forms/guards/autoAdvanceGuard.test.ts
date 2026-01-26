import { GetServerSidePropsContext } from 'next';

import { mockSteps } from '@maps-react/mhf/mocks';
import { ensureSessionAndStore } from '@maps-react/mhf/store';

import { StepName } from '../lib/constants';
import { routeFlow } from '../routes/routeFlow';
import { autoAdvanceGuard } from './autoAdvanceGuard';

jest.mock('@maps-react/mhf/store', () => ({
  ensureSessionAndStore: jest.fn().mockResolvedValue({
    key: 'mock-key',
    responseHeaders: {
      get: jest.fn().mockReturnValue('mock-cookie'),
    },
  }),
  getStoreEntry: jest.fn().mockResolvedValue({
    data: { lang: 'en' },
  }),
}));

jest.mock('@maps-react/mhf/utils', () => ({
  getFlowSteps: jest.fn().mockReturnValue(mockSteps),
}));

jest.mock('../routes/routeFlow', () => ({
  routeFlow: new Map(),
}));

describe('autoAdvanceGuard', () => {
  const res = {
    setHeader: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
  };

  const req = {};

  beforeEach(() => {
    jest.clearAllMocks();
    (routeFlow as Map<string, unknown>).clear();
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
    routeFlow.set('flow-without-auto-advance', {
      steps: ['step1'],
    });
    await autoAdvanceGuard({
      query: { aa: 'flow-without-auto-advance' },
      res,
      req,
    } as unknown as GetServerSidePropsContext);
    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.writeHead).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
  });

  it('redirects to autoAdvanceStep if flow has it configured', async () => {
    routeFlow.set('mock-flow', {
      steps: ['step1', 'mock-step'],
      autoAdvanceStep: 'mock-step' as unknown as StepName,
    });
    await autoAdvanceGuard({
      query: { aa: 'mock-flow' },
      res,
      req,
      params: { language: 'en' },
    } as unknown as GetServerSidePropsContext);

    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', 'mock-cookie');
    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/mock-step',
    });
    expect(res.end).toHaveBeenCalled();
  });

  it('handles array aa query param', async () => {
    routeFlow.set('mock-flow', {
      steps: ['step1', 'mock-step'],
      autoAdvanceStep: 'mock-step' as unknown as StepName,
    });
    await autoAdvanceGuard({
      query: { aa: ['mock-flow'] },
      res,
      req,
      params: { language: ['en'] },
    } as unknown as GetServerSidePropsContext);

    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/mock-step',
    });
    expect(res.end).toHaveBeenCalled();
  });

  it('defaults to "en" if params.language is missing', async () => {
    routeFlow.set('mock-flow', {
      steps: ['step1', 'mock-step'],
      autoAdvanceStep: 'mock-step' as unknown as StepName,
    });
    await autoAdvanceGuard({
      query: { aa: 'mock-flow' },
      res,
      req,
    } as unknown as GetServerSidePropsContext);

    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/mock-step',
    });
    expect(res.end).toHaveBeenCalled();
  });

  it('does not set cookie header if responseHeaders.get returns null', async () => {
    (ensureSessionAndStore as jest.Mock).mockResolvedValueOnce({
      key: 'mock-key',
      responseHeaders: {
        get: jest.fn().mockReturnValue(null),
      },
    });

    routeFlow.set('mock-flow', {
      steps: ['step1', 'mock-step'],
      autoAdvanceStep: 'mock-step' as unknown as StepName,
    });
    await autoAdvanceGuard({
      query: { aa: 'mock-flow' },
      res,
      req,
      params: { language: 'en' },
    } as unknown as GetServerSidePropsContext);

    expect(res.setHeader).not.toHaveBeenCalled();
    expect(res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/mock-step',
    });
    expect(res.end).toHaveBeenCalled();
  });
});
