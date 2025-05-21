import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';

import { Organisation } from '../../../types/Organisations';
import { getContinuationQueryParam } from '../../../utils/organisations/getContinuationQueryParam';

let continuationTokens: string[] = [''];

export const PaginatedTable = () => {
  const [data, setData] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = useRef<number>(1);
  const paginationEvent = useRef<string>('initial');
  const itemsPerPage = 15;

  const resetBeforeSearch = () => {
    setCurrentPage(1);
    totalPages.current = 1;
    paginationEvent.current = 'search';
    continuationTokens = [''];
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    resetBeforeSearch();

    setSearchQuery(e.target.value);
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

        const response = await fetch(
          `/api/organisations?page=${currentPage}&itemsPerPage=${itemsPerPage}&searchQuery=${searchQuery}${continuationParam}`,
        );

        const result = await response.json();

        if (!continuationTokens[currentPage]) {
          continuationTokens[currentPage] = result.continuationToken ?? '';
        }

        if (currentPage === 1) {
          totalPages.current = result.totalPages;
        }

        setData(result.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load data');
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchQuery]);

  const getLicenceStyle = (licence: string) => {
    switch (licence) {
      case 'active':
      case 'Approved': {
        return 'bg-green-200';
      }
      case 'Revoked': {
        return 'bg-red-100';
      }
      case 'Declined': {
        return 'bg-red-400';
      }
      case 'Pending': {
        return 'bg-blue-100';
      }
      case 'Requesting info': {
        return 'bg-magenta-700 text-white';
      }
    }
  };

  return (
    <>
      <form
        className={'bg-gray-50 rounded-lg p-5 mb-8'}
        data-testid="search-form"
      >
        <label htmlFor="search" data-testid="search-label">
          Search for members
        </label>
        <div className="flex ">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search by name or number"
            className="w-full mt-2 mb-4 p-2 border rounded-l max-w-[410px] block"
            value={searchQuery}
            onChange={(e) => handleSearch(e)}
          />
          <button
            title={'Search'}
            className="p-2 bg-pink-600 rounded-r mt-2 mb-4 text-white"
            disabled
          >
            <Icon type={IconType.SEARCH_ICON} />
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {data.length ? (
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
                  {data?.map((org) => (
                    <tr key={org.id} className="border-b odd:bg-gray-50">
                      <td className="p-3 font-semibold">{org.name}</td>
                      <td className="p-3">
                        <Link href={`/admin/${org.licence_number}`}>
                          {org.licence_number}
                        </Link>
                      </td>
                      <td className="p-3">{org.type.title}</td>
                      <td className="p-3">
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
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center p-4">
                <Button
                  className="disabled:opacity-0 text-pink-600 font-semibold"
                  variant={'link'}
                  onClick={() => {
                    paginationEvent.current = 'pagination';
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  iconLeft={
                    <Icon
                      type={IconType.CHEVRON_LEFT}
                      className="fill-pink-600 [&_path]:fill-pink-600"
                    />
                  }
                >
                  Previous
                </Button>

                <span className="text-gray-700 pr-4">
                  Page {currentPage} of {totalPages.current}
                </span>

                <Button
                  className="disabled:opacity-0 text-pink-600 font-semibold"
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
                      className="fill-pink-600 [&_path]:fill-pink-600"
                    />
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <H2>0 results found</H2>
          )}
        </>
      )}
    </>
  );
};
