import type { MainReregistrationDates } from 'lib/admin/shared/firmInheritance/firmInheritance';
import {
  getApprovedAtForAdmin,
  getReregisterApprovedAtForAdmin,
  getReregisteredAtForAdmin,
} from 'lib/admin/shared/firmInheritance/firmInheritance';
import type {
  TravelInsuranceFirmBaseDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';
import { formatDate } from 'utils/formatDate';

export const ADMIN_NOT_APPROVED_LABEL = 'Not approved';
export const ADMIN_NOT_REREGISTERED_LABEL = 'Not reregistered';

export function formatAdminAddedAt(
  firm: TravelInsuranceFirmBaseDocument,
): string {
  return formatDate(firm.created_at);
}

export function formatAdminApprovedAt(
  firm: TravelInsuranceFirmDocument,
  mainApprovedAtByFca: Map<number, string | null>,
): string {
  return formatDate(getApprovedAtForAdmin(firm, mainApprovedAtByFca), {
    fallback: ADMIN_NOT_APPROVED_LABEL,
  });
}

export function formatAdminReregisteredAt(
  firm: TravelInsuranceFirmDocument,
  mainReregistrationByFca: Map<number, MainReregistrationDates>,
): string {
  return formatDate(getReregisteredAtForAdmin(firm, mainReregistrationByFca), {
    fallback: ADMIN_NOT_REREGISTERED_LABEL,
  });
}

export function formatAdminReregisterApprovedAt(
  firm: TravelInsuranceFirmDocument,
  mainReregistrationByFca: Map<number, MainReregistrationDates>,
): string {
  return formatDate(
    getReregisterApprovedAtForAdmin(firm, mainReregistrationByFca),
    { fallback: ADMIN_NOT_APPROVED_LABEL },
  );
}
