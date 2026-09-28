import { createMockFirm } from 'components/FirmSummary/mockFirm';
import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';

import { getDirectoryStatusLabel } from './getDirectoryStatusLabel';

describe('getDirectoryStatusLabel', () => {
  it('returns Approved when firm status is active', () => {
    expect(getDirectoryStatusLabel(createMockFirm({ status: 'active' }))).toBe(
      'Approved',
    );
  });

  it('returns Hidden when firm status is hidden', () => {
    expect(getDirectoryStatusLabel(createMockFirm({ status: 'hidden' }))).toBe(
      'Hidden',
    );
  });

  it('returns Pending approval when firm status is pending_approval', () => {
    expect(
      getDirectoryStatusLabel(createMockFirm({ status: 'pending_approval' })),
    ).toBe('Pending approval');
  });

  describe('AC 1: Blocked State — self-serve directory status', () => {
    // AC 1: And self-serve directory status for this hide is No longer authorised.
    it('shows No longer authorised when hidden_reason is Invalid_FCA', () => {
      expect(
        getDirectoryStatusLabel(
          createMockFirm({
            status: 'hidden',
            hidden_reason: HIDDEN_DUE_TO_FCA,
          }),
        ),
      ).toBe('No longer authorised');
    });
  });

  describe('AC 4: Data retention — self-serve directory status', () => {
    // AC 4: And the directory status must show as No longer valid (Cosmos status remains hidden).
    it('shows No longer valid when hidden_reason is Trading_name-Inactive_or_Not_Current', () => {
      expect(
        getDirectoryStatusLabel(
          createMockFirm({
            status: 'hidden',
            hidden_reason: HIDDEN_DUE_TO_TRADING_NAME,
          }),
        ),
      ).toBe('No longer valid');
    });
  });
});
