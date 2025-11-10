import { GetServerSidePropsContext } from 'next';

import { RouteConfig } from '../lib/types';
import { getCurrentStep } from '../lib/utils';
import { guardMap, runGuards } from './runGuards';

jest.mock('../lib/utils', () => ({
  getCurrentStep: jest.fn(),
}));

describe('runGuards', () => {
  const mockContext = {} as GetServerSidePropsContext;

  let routeConfig: RouteConfig = {
    step1: {
      Component: jest.fn(),
      guards: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    guardMap.guard1 = jest.fn();
    guardMap.guard2 = jest.fn();
  });

  it('should execute all guards for the current step', async () => {
    const routeConfig: RouteConfig = {
      step1: {
        Component: jest.fn(),
        guards: ['guard1', 'guard2'],
      },
    };

    (getCurrentStep as jest.Mock).mockReturnValue('step1');
    await runGuards(mockContext, routeConfig);

    expect(guardMap.guard1).toHaveBeenCalledWith(mockContext);
    expect(guardMap.guard2).toHaveBeenCalledWith(mockContext);
  });

  it('should throw an error if no route is found for the current step', async () => {
    const routeConfig = {};

    (getCurrentStep as jest.Mock).mockReturnValue('invalidStep');

    await expect(runGuards(mockContext, routeConfig)).rejects.toThrow(
      'No route found for step: invalidStep',
    );
  });

  it('should throw an error if guards are not defined or not an array', async () => {
    routeConfig = {
      step1: {
        ...routeConfig.Component,
        guards: undefined as unknown as never[],
      },
    };

    (getCurrentStep as jest.Mock).mockReturnValue('step1');

    await expect(runGuards(mockContext, routeConfig)).rejects.toThrow(
      '[runGuards] Guards for step step1 are not defined or not an array',
    );
  });

  it('should throw an error if a guard is not a function', async () => {
    routeConfig = {
      step1: {
        Component: jest.fn(),
        guards: ['guard1', 'invalidGuard'],
      },
    };

    (getCurrentStep as jest.Mock).mockReturnValue('step1');
    guardMap.invalidGuard = null as unknown as () => Promise<void>;

    await expect(runGuards(mockContext, routeConfig)).rejects.toThrow(
      '[runGuards] Guard "invalidGuard" for step "step1" is not a function.',
    );
  });
});
