import { Action } from '../../../types/admin/base';

export const getStatusByAction = (action: Action | '') => {
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
