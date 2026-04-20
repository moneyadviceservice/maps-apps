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

function getFirmNameParts(firm: TravelInsuranceFirmDocument): {
  parentName: string;
  tradingName: string | null;
} {
  const parentName = firm.registered_name ?? '—';
  const tn = firm.trading_names?.[0];
  const tradingName = tn?.registered_name || tn?.website_address || null;
  return { parentName, tradingName };
}

const COLUMNS: Column[] = [
  {
    key: 'fcaNumber',
    label: 'FCA Number',
    getValue: (firm) => String(firm.fca_number),
  },
  {
    key: 'firmName',
    label: 'Firm name',
    getValue: (firm) => {
      const { parentName, tradingName } = getFirmNameParts(firm);
      return tradingName
        ? `${tradingName} - Subsidiary of ${parentName}`
        : parentName;
    },
    isLink: true,
  },
  {
    key: 'principalName',
    label: 'Principal',
    getValue: (firm) => {
      const p = firm.principals?.[0];
      return p ? `${p.first_name} ${p.last_name}` : '—';
    },
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
  return (
    <span className="inline-block ml-1" aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="7"
        height="5"
        viewBox="0 0 7 5"
        fill="none"
        className={[
          'inline-block text-gray-800',
          active && dir === 'asc' ? 'rotate-180' : '',
        ].join(' ')}
        data-testid="sort-arrow"
      >
        <path
          d="M3.46484 4.5L0.000742352 -1.75695e-07L6.92895 4.29987e-07L3.46484 4.5Z"
          fill="currentColor"
        />
      </svg>
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
    <div className="overflow-x-auto border border-gray-800 rounded">
      <table
        className="w-full text-sm border-collapse"
        data-testid="firms-table"
      >
        <thead>
          <tr className="bg-gray-95">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className="px-3 py-3 text-left font-bold whitespace-nowrap cursor-pointer select-none border-b border-gray-800"
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
                    {col.key === 'firmName' && firm.id ? (
                      (() => {
                        const { parentName, tradingName } =
                          getFirmNameParts(firm);
                        const href = `/admin/firms/${firm.id}`;
                        if (!tradingName) {
                          return (
                            <Link
                              href={href}
                              className="text-pink-600 hover:text-pink-800"
                            >
                              {parentName}
                            </Link>
                          );
                        }

                        return (
                          <span>
                            <Link
                              href={href}
                              className="text-pink-600 hover:text-pink-800"
                            >
                              {tradingName}
                            </Link>
                            <span>{' - Subsidiary of '}</span>
                            <Link
                              href={href}
                              className="text-pink-600 hover:text-pink-800"
                            >
                              {parentName}
                            </Link>
                          </span>
                        );
                      })()
                    ) : col.isLink && firm.id ? (
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
