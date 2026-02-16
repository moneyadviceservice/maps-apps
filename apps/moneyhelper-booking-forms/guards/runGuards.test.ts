import { runGuardsBase } from '@maps-react/mhf/guards';
import { mockContext } from '@maps-react/mhf/mocks';

import { routeConfig } from '../routes/routeConfig';
import { guardMap, runGuards } from './runGuards';

jest.mock('@maps-react/mhf/guards', () => ({
  runGuardsBase: jest.fn(),
  cookieGuard: jest.fn(),
  validateStepGuard: jest.fn(),
}));

describe('runGuards', () => {
  it('calls runGuardsBase with correct arguments', async () => {
    await runGuards(mockContext);

    expect(runGuardsBase).toHaveBeenCalledWith(
      mockContext,
      routeConfig,
      guardMap,
    );
  });
});
