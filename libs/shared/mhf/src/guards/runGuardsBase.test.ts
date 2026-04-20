import { mockContext } from '../mocks';
import { RouteConfig } from '../types';
import { getCurrentStep } from '../utils';
import { runGuardsBase } from './runGuardsBase';

jest.mock('../utils', () => ({
  getCurrentStep: jest.fn(),
}));

describe('runGuardsBase', () => {
  let mockRouteConfig: RouteConfig = {
    step1: {
      Component: jest.fn(),
      guards: ['guard1', 'guard2'],
    },
  };
  const mockGuardMap = {
    guard1: jest.fn().mockResolvedValue(undefined),
    guard2: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should execute all guards for the current step', async () => {
    (getCurrentStep as jest.Mock).mockReturnValue('step1');
    await runGuardsBase(mockContext, mockRouteConfig, mockGuardMap);

    expect(mockGuardMap.guard1).toHaveBeenCalledWith(mockContext);
    expect(mockGuardMap.guard2).toHaveBeenCalledWith(mockContext);
  });

  it('should throw an error if no route is found for the current step', async () => {
    mockRouteConfig = {};

    (getCurrentStep as jest.Mock).mockReturnValue('invalidStep');

    await expect(
      runGuardsBase(mockContext, mockRouteConfig, mockGuardMap),
    ).rejects.toThrow('No route found for step: invalidStep');
  });

  it('should throw an error if guards are not defined or not an array', async () => {
    mockRouteConfig = {
      step1: {
        ...mockRouteConfig.Component,
        guards: undefined as unknown as never[],
      },
    };

    (getCurrentStep as jest.Mock).mockReturnValue('step1');

    await expect(
      runGuardsBase(mockContext, mockRouteConfig, mockGuardMap),
    ).rejects.toThrow(
      '[runGuardsBase] Guards for step step1 are not defined or not an array',
    );
  });

  it('should throw an error if a guard is not a function', async () => {
    mockRouteConfig = {
      step1: {
        Component: jest.fn(),
        guards: ['invalidGuard'],
      },
    };

    (getCurrentStep as jest.Mock).mockReturnValue('step1');

    await expect(
      runGuardsBase(mockContext, mockRouteConfig, mockGuardMap),
    ).rejects.toThrow(
      '[runGuardsBase] Guard "invalidGuard" for step "step1" is not a function.',
    );
  });
});
