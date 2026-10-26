import { Action } from '../../../types/admin/base';
import { getStatusByAction } from './getStatusByAction';

describe('getStatusByAction', () => {
  it.each([
    ['approve', 'active'],
    ['revoked', 'Revoked'],
    ['decline', 'Declined'],
    ['pending', 'Pending'],
    ['requestMoreInfo', 'Requesting info'],
    ['', 'Pending'],
  ])('returns "%s" => "%s"', (action, expected) => {
    expect(getStatusByAction(action as Action)).toBe(expected);
  });
});
