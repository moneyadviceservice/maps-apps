import { getDirectoryStatusLabel } from 'lib/account/dashboard/getDirectoryStatusLabel';
import type { OtherListedFirm } from 'lib/admin/detail/actionVisibility/actionVisibility';
import {
  formatPrincipalName,
  getPrincipalForAdminDetail,
  getWebsiteAddressForAdmin,
} from 'lib/admin/shared/firmDetailDisplay/firmDetailDisplay';
import {
  buildMainReregistrationByFirmId,
  getReregisterApprovedAtForAdmin,
  getReregisteredAtForAdmin,
} from 'lib/admin/shared/firmInheritance/firmInheritance';
import { isMainFirm, isTradingFirm } from 'lib/firms/firmDocument';
import type {
  MainTravelInsuranceFirmDocument,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';
import { formatDate } from 'utils/formatDate';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';

import { AdminDirectoryActionForm } from './AdminDirectoryActionForm';
import { AdminReregisterActionForm } from './AdminReregisterActionForm';

type DetailRow = {
  label: string;
  value: string;
  href?: string;
};

function buildRows(
  firm: TravelInsuranceFirmDocument,
  mainFirm: MainTravelInsuranceFirmDocument | null,
): DetailRow[] {
  const principal = getPrincipalForAdminDetail(firm, mainFirm);
  const website = getWebsiteAddressForAdmin(firm, mainFirm);
  const mainReregistrationByFirmId = buildMainReregistrationByFirmId(
    mainFirm ? [mainFirm] : [],
  );
  const fmt = (v: string | null | undefined) =>
    formatDate(v, { format: 'long' });

  const rows: DetailRow[] = [
    {
      label: 'Principal',
      value: formatPrincipalName(principal),
    },
    {
      label: 'Principal Email',
      value: principal?.email_address ?? '—',
      href: principal?.email_address
        ? `mailto:${principal.email_address}`
        : undefined,
    },
    {
      label: 'Principal Phone',
      value: principal?.telephone_number ?? '—',
    },
    {
      label: 'Registered name',
      value: firm.registered_name ?? '—',
    },
    {
      label: 'FRN (FCA Firm Reference Number)',
      value: String(firm.fca_number),
    },
    {
      label: 'Status',
      value: getDirectoryStatusLabel(firm),
    },
    {
      label: 'Website Address',
      value: website ?? '—',
      href: website ?? undefined,
    },
    { label: 'Added', value: fmt(firm.created_at) },
    { label: 'Approved', value: fmt(firm.approved_at) },
  ];

  if (isMainFirm(firm) || (isTradingFirm(firm) && mainFirm)) {
    rows.push(
      {
        label: 'Reregistered',
        value: fmt(getReregisteredAtForAdmin(firm, mainReregistrationByFirmId)),
      },
      {
        label: 'Reregistration Approved',
        value: fmt(
          getReregisterApprovedAtForAdmin(firm, mainReregistrationByFirmId),
        ),
      },
    );
  }

  return rows;
}

export type FirmDetailProps = {
  firm: TravelInsuranceFirmDocument;
  mainFirm?: MainTravelInsuranceFirmDocument | null;
  showApproveButton?: boolean;
  showHideButton?: boolean;
  showReregisterButton?: boolean;
  approveButtonLabel?: 'Add to Directory' | 'Keep on directory';
  otherListedFirm?: OtherListedFirm | null;
};

export const FirmDetail = ({
  firm,
  mainFirm = null,
  showApproveButton = false,
  showHideButton = false,
  showReregisterButton = false,
  approveButtonLabel = 'Add to Directory',
  otherListedFirm = null,
}: FirmDetailProps) => {
  const rows = buildRows(firm, mainFirm);
  const showActions =
    showApproveButton || showHideButton || showReregisterButton;

  return (
    <Container>
      <div className="space-y-6 py-8">
        <BackLink href="/admin/dashboard">Back</BackLink>

        <Heading
          level="h1"
          className="text-4xl font-bold"
          data-testid="firm-detail-heading"
        >
          {firm.registered_name}
        </Heading>

        <table className="w-full max-w-3xl text-base">
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-gray-200">
                <td className="py-3 pr-8 font-semibold text-gray-800 whitespace-nowrap align-top">
                  {row.label}
                </td>
                <td className="py-3 text-gray-800">
                  {row.href ? (
                    <Link
                      href={row.href}
                      className="text-pink-600 hover:text-pink-800"
                      target={
                        row.href.startsWith('mailto:') ? undefined : '_blank'
                      }
                    >
                      {row.value}
                    </Link>
                  ) : (
                    row.value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {otherListedFirm ? (
          <p
            className="max-w-3xl text-gray-800"
            data-testid="other-listed-firm-message"
          >
            Another firm in this FCA group is already listed on the directory.
            Only one main firm or trading name can be listed for each FCA
            number.{' '}
            <Link
              href={`/admin/firms/${otherListedFirm.id}`}
              className="text-pink-600 hover:text-pink-800"
            >
              {otherListedFirm.registeredName}
            </Link>
          </p>
        ) : null}

        {showActions ? (
          <div className="flex flex-wrap gap-3">
            {showApproveButton ? (
              <AdminDirectoryActionForm
                firmId={firm.id}
                action="approve"
                label={approveButtonLabel}
              />
            ) : null}
            {showHideButton ? (
              <AdminDirectoryActionForm
                firmId={firm.id}
                action="hide"
                label="Hide from Directory"
              />
            ) : null}
            {showReregisterButton ? (
              <AdminReregisterActionForm firmId={firm.id} />
            ) : null}
          </div>
        ) : null}
      </div>
    </Container>
  );
};
