import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { formatDate } from 'utils/formatDate';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';

type DetailRow = {
  label: string;
  value: string;
  href?: string;
};

function buildRows(firm: TravelInsuranceFirmDocument): DetailRow[] {
  const principal = firm.principals?.[0];
  const fmt = (v: string | null | undefined) =>
    formatDate(v, { format: 'long' });

  return [
    {
      label: 'Principal',
      value: principal ? `${principal.first_name} ${principal.last_name}` : '—',
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
      label: 'Website Address',
      value: firm.website_address ?? '—',
      href: firm.website_address ?? undefined,
    },
    { label: 'Added', value: fmt(firm.created_at) },
    { label: 'Approved', value: fmt(firm.approved_at) },
    { label: 'Reregistered', value: fmt(firm.reregistered_at) },
    {
      label: 'Reregistration Approved',
      value: fmt(firm.reregister_approved_at),
    },
  ];
}

export type FirmDetailProps = {
  firm: TravelInsuranceFirmDocument;
};

export const FirmDetail = ({ firm }: FirmDetailProps) => {
  const rows = buildRows(firm);

  return (
    <Container>
      <div className="space-y-6 py-8">
        <BackLink href="/admin/dashboard">Back</BackLink>

        <Heading level="h1" className="text-4xl font-bold">
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
      </div>
    </Container>
  );
};
