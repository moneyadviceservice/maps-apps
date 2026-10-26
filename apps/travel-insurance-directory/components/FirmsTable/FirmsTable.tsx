import { useRouter } from 'next/router';

import { getDirectoryStatusLabel } from 'lib/account/dashboard/getDirectoryStatusLabel';
import {
  formatAdminAddedAt,
  formatAdminApprovedAt,
  formatAdminReregisterApprovedAt,
  formatAdminReregisteredAt,
} from 'lib/admin/dashboard/tableDisplay/tableDisplay';
import { formatPrincipalName } from 'lib/admin/shared/firmDetailDisplay/firmDetailDisplay';
import {
  getFirmDisplayNameForAdmin,
  getPrincipalForAdmin,
  type MainReregistrationDates,
} from 'lib/admin/shared/firmInheritance/firmInheritance';
import { isTradingFirm } from 'lib/firms/firmDocument';
import { SortDir } from 'types/admin';
import type {
  Principal,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

import { Link } from '@maps-react/common/components/Link';

type Column = {
  key: string;
  label: string;
  getValue: (firm: TravelInsuranceFirmDocument) => string;
  isLink?: boolean;
};

function toFirmIdMap<T>(record: Record<string, T>): Map<string, T> {
  return new Map(Object.entries(record));
}

function buildColumns(
  mainPrincipalByFirmId: Map<string, Principal>,
  mainRegisteredNameByFirmId: Map<string, string>,
  mainApprovedAtByFirmId: Map<string, string | null>,
  mainReregistrationByFirmId: Map<string, MainReregistrationDates>,
): Column[] {
  return [
    {
      key: 'fcaNumber',
      label: 'FCA Number',
      getValue: (firm) => String(firm.fca_number),
    },
    {
      key: 'firmName',
      label: 'Firm name',
      getValue: (firm) =>
        getFirmDisplayNameForAdmin(firm, mainRegisteredNameByFirmId),
      isLink: true,
    },
    {
      key: 'status',
      label: 'Status',
      getValue: (firm) => getDirectoryStatusLabel(firm),
    },
    {
      key: 'principalName',
      label: 'Principal',
      getValue: (firm) =>
        formatPrincipalName(getPrincipalForAdmin(firm, mainPrincipalByFirmId)),
    },
    {
      key: 'addedAt',
      label: 'Added',
      getValue: (firm) => formatAdminAddedAt(firm),
    },
    {
      key: 'approvedAt',
      label: 'Approved',
      getValue: (firm) => formatAdminApprovedAt(firm, mainApprovedAtByFirmId),
    },
    {
      key: 'reregisteredAt',
      label: 'Reregistered',
      getValue: (firm) =>
        formatAdminReregisteredAt(firm, mainReregistrationByFirmId),
    },
    {
      key: 'reapprovedAt',
      label: 'Reapproved',
      getValue: (firm) =>
        formatAdminReregisterApprovedAt(firm, mainReregistrationByFirmId),
    },
  ];
}

const firmNameLinkClassName = 'text-pink-600 hover:text-pink-800';

function renderFirmNameCell(
  firm: TravelInsuranceFirmDocument,
  mainRegisteredNameByFirmId: Map<string, string>,
) {
  const displayName = getFirmDisplayNameForAdmin(
    firm,
    mainRegisteredNameByFirmId,
  );

  if (!firm.id) {
    return displayName;
  }

  if (isTradingFirm(firm)) {
    const mainId = firm.main_firm_id?.trim();
    const mainName = mainId
      ? mainRegisteredNameByFirmId.get(mainId)?.trim()
      : undefined;
    const tradingName = firm.registered_name?.trim() || '—';

    if (mainId && mainName) {
      return (
        <>
          <Link
            href={`/admin/firms/${firm.id}`}
            className={firmNameLinkClassName}
          >
            {tradingName}
          </Link>
          {' subsidiary of '}
          <Link
            href={`/admin/firms/${mainId}`}
            className={firmNameLinkClassName}
          >
            {mainName}
          </Link>
        </>
      );
    }
  }

  return (
    <Link href={`/admin/firms/${firm.id}`} className={firmNameLinkClassName}>
      {displayName}
    </Link>
  );
}

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
  mainPrincipalByFirmId?: Record<string, Principal>;
  mainRegisteredNameByFirmId?: Record<string, string>;
  mainApprovedAtByFirmId?: Record<string, string | null>;
  mainReregistrationByFirmId?: Record<string, MainReregistrationDates>;
  sortBy?: string | null;
  sortDir?: SortDir;
};

export const FirmsTable = ({
  firms,
  mainPrincipalByFirmId = {},
  mainRegisteredNameByFirmId = {},
  mainApprovedAtByFirmId = {},
  mainReregistrationByFirmId = {},
  sortBy,
  sortDir = 'asc',
}: FirmsTableProps) => {
  const router = useRouter();
  const principalMap = toFirmIdMap(mainPrincipalByFirmId);
  const mainNameMap = toFirmIdMap(mainRegisteredNameByFirmId);
  const approvedAtMap = toFirmIdMap(mainApprovedAtByFirmId);
  const reregistrationMap = toFirmIdMap(mainReregistrationByFirmId);
  const columns = buildColumns(
    principalMap,
    mainNameMap,
    approvedAtMap,
    reregistrationMap,
  );

  const handleSort = (columnKey: string) => {
    const newDir = sortBy === columnKey && sortDir === 'asc' ? 'desc' : 'asc';
    const query = { ...router.query, sortBy: columnKey, sortDir: newDir };
    router.push({ pathname: router.pathname, query });
  };

  const handleResetSearch = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push({ pathname: router.pathname, query: {} });
  };

  return (
    <div className="overflow-x-auto border border-gray-800 rounded">
      <table
        className="w-full text-sm border-collapse"
        data-testid="firms-table"
      >
        <thead>
          <tr className="bg-gray-95">
            {columns.map((col) => (
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
                colSpan={columns.length}
                className="px-3 py-10 text-center text-gray-800"
              >
                <p
                  className="mb-4 leading-relaxed text-gray-800"
                  data-testid="no-results-text"
                >
                  There are no matching results. Improve your search by checking
                  your spelling or using fewer keywords.
                </p>
                <Link
                  href="/admin/dashboard"
                  onClick={handleResetSearch}
                  data-testid="reset-search-link"
                >
                  Reset search
                </Link>
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
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-3 py-2.5 border-t border-gray-200 whitespace-nowrap"
                  >
                    {col.key === 'firmName' ? (
                      renderFirmNameCell(firm, mainNameMap)
                    ) : col.isLink && firm.id ? (
                      <Link
                        href={`/admin/firms/${firm.id}`}
                        className={firmNameLinkClassName}
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
