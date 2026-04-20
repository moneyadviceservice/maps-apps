import { GetServerSidePropsContext } from 'next';

import { ensureSessionAndStore } from '@maps-react/mhf/store';

import { ContactFlowConfigMap } from '../lib/types';
import { flowConfig } from '../routes/flowConfig';
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

jest.mock('../routes/flowConfig', () => ({
  flowConfig: new Map() as ContactFlowConfigMap,
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
    flowConfig.clear();
  });

  it('handles array aa query param', async () => {
    flowConfig.set('mock-flow', {
      autoAdvanceStep: 'mock-step',
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
    flowConfig.set('mock-flow', {
      autoAdvanceStep: 'mock-step',
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

    flowConfig.set('mock-flow', {
      autoAdvanceStep: 'mock-step',
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
