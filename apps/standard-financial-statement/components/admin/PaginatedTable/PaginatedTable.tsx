import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { ORG_SEARCH_INPUT_DEBOUNCE_MS } from 'lib/constants';
import {
  LICENCE_STATUS_VALUES,
  LicenceStatus,
  Organisation,
} from 'types/Organisations';
import { getContinuationQueryParam } from 'utils/organisations/getContinuationQueryParam';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { capitalizeFirstLetter } from '@maps-react/common/utils/string';
import { CheckboxGroup } from '@maps-react/form/components/Checkbox';

let continuationTokens: string[] = [''];

export const PaginatedTable = () => {
  const [data, setData] = useState<Organisation[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInputValue, setSearchInputValue] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [licenceStatusFilter, setLicenceStatusFilter] = useState<
    Record<keyof typeof LICENCE_STATUS_VALUES, boolean>
  >({
    active: false,
    declined: false,
    pending: false,
    requesting_info: false,
    revoked: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = useRef<number>(1);
  const paginationEvent = useRef<string>('initial');
  const itemsPerPage = 15;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const resetBeforeSearch = () => {
    setCurrentPage(1);
    totalPages.current = 1;
    paginationEvent.current = 'search';
    continuationTokens = [''];
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchInputValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      resetBeforeSearch();
      setSearchQuery(value);
    }, ORG_SEARCH_INPUT_DEBOUNCE_MS);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const continuationToken =
          paginationEvent.current === 'pagination'
            ? continuationTokens[currentPage - 1]
            : undefined;

        const continuationParam = getContinuationQueryParam(continuationToken);

        const statusFilterQuery = Object.keys(LICENCE_STATUS_VALUES)
          .filter(
            (key) =>
              licenceStatusFilter[key as keyof typeof licenceStatusFilter] ===
              true,
          )
          .join(',');

        const response = await fetch(
          `/api/organisations?page=${currentPage}&itemsPerPage=${itemsPerPage}&searchQuery=${searchQuery}&filterQuery=${statusFilterQuery}${continuationParam}`,
        );

        const result = await response.json();

        if (!continuationTokens[currentPage]) {
          continuationTokens[currentPage] = result.continuationToken ?? '';
        }

        if (currentPage === 1) {
          totalPages.current = result.totalPages;
        }

        setData(result.data);
        setTotalRecords(result.totalRecords);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchQuery, licenceStatusFilter]);

  const getStatusMessage = (totalRecords: number) => {
    switch (totalRecords) {
      case 0: {
        return '0 organisations found';
      }
      case 1: {
        return 'Showing 1 organisation';
      }
      default: {
        return `Showing ${totalRecords} organisations`;
      }
    }
  };

  useEffect(() => {
    const message = getStatusMessage(totalRecords);
    setStatusMessage(message);
  }, [totalRecords]);

  const getLicenceStyle = (licence: LicenceStatus) => {
    switch (licence) {
      case LICENCE_STATUS_VALUES.active: {
        return 'bg-green-200';
      }
      case LICENCE_STATUS_VALUES.revoked: {
        return 'bg-red-100';
      }
      case LICENCE_STATUS_VALUES.declined: {
        return 'bg-red-400';
      }
      case LICENCE_STATUS_VALUES.pending: {
        return 'bg-blue-100';
      }
      case LICENCE_STATUS_VALUES.requesting_info: {
        return 'bg-magenta-800 text-white';
      }
    }
  };

  return (
    <>
      <form
        className={'bg-gray-50 rounded-lg p-5 mb-8'}
        data-testid="search-form"
      >
        <div className="flex flex-col xl:flex-row">
          <div>
            <label htmlFor="search" data-testid="search-label">
              Search for members
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search by name or number"
                className="w-full mt-2 mb-4 p-2 border border-r-0 border-gray-650 rounded-l max-w-[410px] block"
                value={searchInputValue}
                onChange={(e) => handleSearch(e)}
              />
              <button
                title={'Search'}
                className="p-2 bg-transparent border-2 border-gray-400 rounded-r mt-2 mb-4 text-gray-650"
                disabled
              >
                <Icon type={IconType.SEARCH_ICON} />
              </button>
            </div>
          </div>
          <div className="flex xl:ml-4">
            <CheckboxGroup
              name="status-filter"
              items={Object.keys(LICENCE_STATUS_VALUES).map((key) => ({
                value: key as keyof typeof LICENCE_STATUS_VALUES,
                label: capitalizeFirstLetter(
                  LICENCE_STATUS_VALUES[
                    key as keyof typeof LICENCE_STATUS_VALUES
                  ],
                ),
              }))}
              testId="orgs-table-status-filter"
              label="Filter by status"
              className="ml-0 xl:ml-4 md:[&_fieldset]:flex md:[&_fieldset]:flex-row md:[&_legend]:text-base md:[&_label]:mr-5 md:[&_label:last-child]:mr-0"
              onChange={(e) => {
                setLicenceStatusFilter({
                  ...licenceStatusFilter,
                  [e.currentTarget.value]: e.currentTarget.checked,
                });
                setCurrentPage(1);
                continuationTokens = [''];
              }}
            />
          </div>
        </div>
      </form>

      {error && (
        <p className="text-red-500" aria-live="assertive">
          {error}
        </p>
      )}

      <p
        className="mb-4 break-words text-xl font-bold text-blue-600"
        data-testid="paragraph"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {loading ? (
          <span>Searching organisations</span>
        ) : (
          <span>{statusMessage}</span>
        )}
      </p>

      {!loading && !error && (
        <>
          {data.length > 0 && (
            <div className="border rounded-lg overflow-scroll">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b font-normal">
                    <th className="p-3 font-normal">Organisation Name</th>
                    <th className="p-3 font-normal">Membership Code</th>
                    <th className="p-3 font-normal">Organisation Type</th>
                    <th className="p-3 font-normal">License Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((org, index) => {
                    const isOdd = index % 2 === 0;
                    return (
                      <tr
                        key={org.id}
                        className={`border-b hover:bg-gray-100 ${
                          isOdd ? 'bg-gray-50' : ''
                        }`}
                      >
                        <td className="p-3 text-gray-800">
                          <Link
                            href={`/admin/${org.licence_number}`}
                            className="font-semibold"
                          >
                            {org.name}
                          </Link>
                        </td>
                        <td className="p-3 text-gray-800">
                          {org.licence_number}
                        </td>
                        <td className="p-3 text-gray-800">{org.type.title}</td>
                        <td className="p-3 text-gray-800">
                          <span
                            className={`${getLicenceStyle(
                              org.licence_status,
                            )} rounded-full py-2 px-4`}
                          >
                            {org.licence_status === 'active'
                              ? 'Approved'
                              : org.licence_status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div
                className="flex justify-between items-center p-4"
                data-testid="admin-dashboard-pagination"
              >
                <Button
                  data-testid="admin-dashboard-pagination-prev"
                  className="disabled:opacity-0 text-magenta-800 font-semibold"
                  variant={'link'}
                  onClick={() => {
                    paginationEvent.current = 'pagination';
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  iconLeft={
                    <Icon
                      type={IconType.CHEVRON_LEFT}
                      className="fill-magenta-800 [&_path]:fill-magenta-800"
                    />
                  }
                >
                  Previous
                </Button>

                <span
                  data-testid="admin-dashboard-pagination-status"
                  className="text-magenta-800 pr-4"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  Page {currentPage} of {totalPages.current}
                </span>

                <Button
                  data-testid="admin-dashboard-pagination-next"
                  className="disabled:opacity-0 text-magenta-800 font-semibold"
                  variant={'link'}
                  onClick={() => {
                    paginationEvent.current = 'pagination';
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages.current),
                    );
                  }}
                  disabled={currentPage === totalPages.current}
                  iconRight={
                    <Icon
                      type={IconType.CHEVRON_RIGHT}
                      className="fill-magenta-800 [&_path]:fill-magenta-800"
                    />
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
