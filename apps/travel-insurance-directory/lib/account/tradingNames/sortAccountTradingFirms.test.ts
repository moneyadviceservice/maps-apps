import { createMockTradingFirm } from 'components/FirmSummary/mockFirm';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';

import { sortAccountTradingFirms } from './sortAccountTradingFirms';

describe('sortAccountTradingFirms', () => {
  it('puts valid firms before FCA-blocked firms', () => {
    const invalid = createMockTradingFirm({
      id: 'invalid',
      registered_name: 'Old Brand',
      created_at: '2025-06-01T00:00:00.000Z',
      hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
    });
    const valid = createMockTradingFirm({
      id: 'valid',
      registered_name: 'New Brand',
      created_at: '2025-01-01T00:00:00.000Z',
    });

    expect(sortAccountTradingFirms([invalid, valid]).map((f) => f.id)).toEqual([
      'valid',
      'invalid',
    ]);
  });

  it('sorts newest created_at first within valid and blocked groups', () => {
    const olderValid = createMockTradingFirm({
      id: 'older-valid',
      created_at: '2025-01-01T00:00:00.000Z',
    });
    const newerValid = createMockTradingFirm({
      id: 'newer-valid',
      created_at: '2025-03-01T00:00:00.000Z',
    });
    const olderBlocked = createMockTradingFirm({
      id: 'older-blocked',
      created_at: '2025-02-01T00:00:00.000Z',
      hidden_reason: HIDDEN_DUE_TO_FCA,
    });
    const newerBlocked = createMockTradingFirm({
      id: 'newer-blocked',
      created_at: '2025-04-01T00:00:00.000Z',
      hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
    });

    expect(
      sortAccountTradingFirms([
        olderBlocked,
        olderValid,
        newerBlocked,
        newerValid,
      ]).map((f) => f.id),
    ).toEqual(['newer-valid', 'older-valid', 'newer-blocked', 'older-blocked']);
  });
});
