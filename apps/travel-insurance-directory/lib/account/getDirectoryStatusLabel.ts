import {
  HIDDEN_DUE_TO_FCA,
  HIDDEN_DUE_TO_TRADING_NAME,
} from 'lib/firms/fcaVisibility';
import type {
  FirmStatus,
  TravelInsuranceFirmBaseDocument,
} from 'types/travel-insurance-firm';

const directoryStatusLabels: Record<FirmStatus, string> = {
  active: 'Approved',
  hidden: 'Hidden',
  pending_approval: 'Pending approval',
};

export function getDirectoryStatusLabel(
  firm: Pick<TravelInsuranceFirmBaseDocument, 'status' | 'hidden_reason'>,
): string {
  if (firm.hidden_reason === HIDDEN_DUE_TO_FCA) {
    return 'No longer authorised';
  }
  if (firm.hidden_reason === HIDDEN_DUE_TO_TRADING_NAME) {
    return 'No longer valid';
  }
  return directoryStatusLabels[firm.status];
}
