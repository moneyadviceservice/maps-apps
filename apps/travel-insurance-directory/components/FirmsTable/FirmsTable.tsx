import { useRouter } from 'next/router';
import { SortDir } from 'types/admin';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';
import { formatDate } from 'utils/formatDate';

import { Link } from '@maps-react/common/components/Link';

type Column = {
  key: string;
  label: string;
  getValue: (firm: TravelInsuranceFirmDocument) => string;
  isLink?: boolean;
};

const COLUMNS: Column[] = [
  {
    key: 'principalName',
    label: 'Principal First Name and Last Name',
    getValue: (firm) => {
      const p = firm.principals?.[0];
      return p ? `${p.first_name} ${p.last_name}` : '—';
    },
  },
  {
    key: 'fcaNumber',
    label: 'FCA Number',
    getValue: (firm) => String(firm.fca_number),
  },
  {
    key: 'firmName',
    label: 'Firm Registered Name',
    getValue: (firm) => firm.registered_name ?? '—',
    isLink: true,
  },
  {
    key: 'addedAt',
    label: 'Added',
    getValue: (firm) => formatDate(firm.created_at),
  },
  {
    key: 'approvedAt',
    label: 'Approved',
    getValue: (firm) => formatDate(firm.approved_at, { fallback: 'Hidden' }),
  },
  {
    key: 'reregisteredAt',
    label: 'Reregistered',
    getValue: (firm) =>
      formatDate(firm.reregistered_at, { fallback: 'Not Reregistered' }),
  },
  {
    key: 'reapprovedAt',
    label: 'Reapproved',
    getValue: (firm) =>
      formatDate(firm.reregister_approved_at, { fallback: 'Not Approved' }),
  },
];

function getAriaSort(
  isActive: boolean,
  dir: SortDir,
): 'ascending' | 'descending' | 'none' {
  if (!isActive) return 'none';
  return dir === 'asc' ? 'ascending' : 'descending';
}

function SortArrow({
  active,
  dir,
}: Readonly<{ active: boolean; dir: SortDir }>) {
  const getArrow = () => {
    if (!active) return '\u25BC';
    return dir === 'asc' ? '\u25B2' : '\u25BC';
  };

  return (
    <span className="inline-block ml-1 text-xs" aria-hidden="true">
      {getArrow()}
    </span>
  );
}

export type FirmsTableProps = {
  firms: TravelInsuranceFirmDocument[];
  sortBy?: string | null;
  sortDir?: SortDir;
};

export const FirmsTable = ({
  firms,
  sortBy,
  sortDir = 'asc',
}: FirmsTableProps) => {
  const router = useRouter();

  const handleSort = (columnKey: string) => {
    const newDir = sortBy === columnKey && sortDir === 'asc' ? 'desc' : 'asc';
    const query = { ...router.query, sortBy: columnKey, sortDir: newDir };
    router.push({ pathname: router.pathname, query });
  };

  return (
    <div className="overflow-x-auto border border-slate-200 rounded">
      <table
        className="w-full text-sm border-collapse"
        data-testid="firms-table"
      >
        <thead>
          <tr className="bg-gray-95">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-3 py-3 text-left font-semibold whitespace-nowrap cursor-pointer select-none border-r border-blue-800 last:border-r-0"
                onClick={() => handleSort(col.key)}
                aria-sort={getAriaSort(sortBy === col.key, sortDir)}
              >
                {col.label}
                <SortArrow active={sortBy === col.key} dir={sortDir} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {firms.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="px-3 py-6 text-center text-gray-500"
              >
                No firms found.
              </td>
            </tr>
          ) : (
            firms.map((firm, index) => (
              <tr
                key={firm.id ?? firm.fca_number}
                className={
                  index % 2 === 0
                    ? 'bg-white hover:bg-blue-50'
                    : 'bg-slate-200 hover:bg-slate-300'
                }
                data-testid="firms-table-row"
              >
                {COLUMNS.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 py-2.5 border-t border-gray-200 whitespace-nowrap"
                  >
                    {col.isLink && firm.id ? (
                      <Link
                        href={`/admin/firms/${firm.id}`}
                        className="text-pink-600 hover:text-pink-800"
                      >
                        {col.getValue(firm)}
                      </Link>
                    ) : (
                      col.getValue(firm)
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
