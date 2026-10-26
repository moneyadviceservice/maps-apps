import { Action } from '../../../types/admin/base';
import { type LicenceStatus } from '../../../types/Organisations';

export const getStatusByAction = (action: Action | ''): LicenceStatus => {
  switch (action) {
    case 'approve':
      return 'active';
    case 'revoked':
      return 'Revoked';
    case 'decline':
      return 'Declined';
    case 'pending':
      return 'Pending';
    case 'requestMoreInfo':
      return 'Requesting info';
    default:
      return 'Pending';
  }
};
