import { GetServerSidePropsContext } from 'next';

import { ensureSessionAndStore } from '../lib/utils/ensureSessionAndStore';
import { autoAdvanceGuard } from './autoAdvanceGuard';

const MockFlowName = {
  MOCK_FLOW: 'mock-flow',
  OTHER_FLOW: 'other-flow',
};

const mockSteps = ['first-step', 'second-step', 'third-step'];

jest.mock('../lib/constants', () => ({
  AUTO_ADVANCE_STEP_MAP: {
    ['mock-flow']: 'second-step',
  },
  FlowName: {
    MOCK_FLOW: 'mock-flow',
    OTHER_FLOW: 'other-flow',
  },
}));

jest.mock('../store', () => ({
  getStoreEntry: jest.fn(async () => ({
    data: { lang: 'en' },
  })),
}));

jest.mock('../lib/utils/getFlowSteps', () => ({
  getFlowSteps: jest.fn(() => mockSteps),
}));
jest.mock('../lib/utils/ensureSessionAndStore', () => ({
  ensureSessionAndStore: jest.fn(async () => ({
    key: 'mock-key',
    responseHeaders: new Headers({ 'Set-Cookie': 'fsid=mock-key;' }),
  })),
}));

const mockRes = () => {
  const headers: Record<string, string> = {};
  return {
    setHeader: jest.fn(),
    writeHead: jest.fn(),
    end: jest.fn(),
    headers,
  };
};

describe('autoAdvanceGuard', () => {
  it('redirects to the correct step for a valid mock flow and uses defauly langStr', async () => {
    const context = {
      query: { aa: MockFlowName.MOCK_FLOW },
      params: {},
      req: {},
      res: mockRes(),
    } as unknown as GetServerSidePropsContext;
    await autoAdvanceGuard(context);

    expect(ensureSessionAndStore).toHaveBeenCalledWith(
      context.req,
      MockFlowName.MOCK_FLOW,
      1,
      true,
      'en',
    );
    expect(context.res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/second-step',
    });
    expect(context.res.setHeader).toHaveBeenCalledWith(
      'Set-Cookie',
      'fsid=mock-key;',
    );
    expect(context.res.end).toHaveBeenCalled();
  });

  it('redirects using the language from params if available', async () => {
    const context = {
      query: { aa: MockFlowName.MOCK_FLOW },
      params: { language: 'cy' },
      req: {},
      res: mockRes(),
    } as unknown as GetServerSidePropsContext;
    await autoAdvanceGuard(context);
    expect(ensureSessionAndStore).toHaveBeenCalledWith(
      context.req,
      MockFlowName.MOCK_FLOW,
      1,
      true,
      'cy',
    );
    expect(context.res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/second-step',
    });
  });

  it('redirects using the first language from params array if available', async () => {
    const context = {
      query: { aa: MockFlowName.MOCK_FLOW },
      params: { language: ['cy', 'en'] },
      req: {},
      res: mockRes(),
    } as unknown as GetServerSidePropsContext;
    await autoAdvanceGuard(context);
    expect(ensureSessionAndStore).toHaveBeenCalledWith(
      context.req,
      MockFlowName.MOCK_FLOW,
      1,
      true,
      'cy',
    );
    expect(context.res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/second-step',
    });
  });

  it('does nothing for a flow not in the map', async () => {
    const context = {
      query: { aa: 'not-a-flow' },
      req: {},
      res: mockRes(),
    } as unknown as GetServerSidePropsContext;
    await autoAdvanceGuard(context);
    expect(context.res.writeHead).not.toHaveBeenCalled();
    expect(context.res.setHeader).not.toHaveBeenCalled();
    expect(context.res.end).not.toHaveBeenCalled();
  });

  it('handles array query param', async () => {
    const context = {
      query: { aa: [MockFlowName.MOCK_FLOW, MockFlowName.OTHER_FLOW] },
      req: {},
      res: mockRes(),
    } as unknown as GetServerSidePropsContext;
    await autoAdvanceGuard(context);
    expect(context.res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/second-step',
    });
  });

  it('does not set Set-Cookie header if not present in responseHeaders', async () => {
    // Patch the ensureSessionAndStore mock to return no Set-Cookie header
    const utils = await import('../lib/utils/ensureSessionAndStore');
    const spy = jest
      .spyOn(utils, 'ensureSessionAndStore')
      .mockImplementationOnce(async () => ({
        key: 'mock-key',
        responseHeaders: new Headers(), // No Set-Cookie
      }));
    const context = {
      query: { aa: MockFlowName.MOCK_FLOW },
      req: {},
      res: mockRes(),
    } as unknown as GetServerSidePropsContext;
    await autoAdvanceGuard(context);
    expect(context.res.setHeader).not.toHaveBeenCalledWith(
      'Set-Cookie',
      expect.anything(),
    );
    expect(context.res.writeHead).toHaveBeenCalledWith(303, {
      Location: '/en/second-step',
    });
    expect(context.res.end).toHaveBeenCalled();
    spy.mockRestore();
  });
});
