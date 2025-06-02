import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { Organisation, OrgProps } from '../../types/Organisations';
import { generateFilterQueryParams } from '../../utils/organisations/generateFilterQueryParams';
import { getContinuationQueryParam } from '../../utils/organisations/getContinuationQueryParam';
import { SearchOrgInput } from './SearchOrgInput';
import { SelectOrgType } from './SelectOrgType';

let continuationTokens: string[] = [''];

export const Organisations = ({
  data,
  name = '',
  type = '',
  currentPage,
  totalRecords,
  totalPages,
  pagePath,
  continuationToken,
  lang,
}: OrgProps & { lang: string; pagePath?: string }) => {
  const { z } = useTranslation();

  const tableId = 'table';

  const [noJs, setNoJs] = useState(true);
  const [stateData, setStateData] = useState<Organisation[]>(data);
  const [error, setError] = useState<string | null>(null);
  const [searchOrgName, setSearchOrgName] = useState<string>(name);
  const [searchOrgType, setSearchOrgType] = useState<string>(type);

  const refTotalRecords = useRef<number>(totalRecords);
  const refTotalPages = useRef<number>(totalPages);
  const refCurrentPage = useRef<number>(currentPage);

  useEffect(() => {
    setNoJs(false);
    if (continuationToken) {
      continuationTokens[1] = continuationToken;
    }
  }, []);

  const resetBeforeNewSearch = () => {
    refCurrentPage.current = 1;
    continuationTokens = [''];
  };

  const searchByTextInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const orgName = e.target.value;

    if (orgName === searchOrgName) {
      return;
    }

    setSearchOrgName(orgName);

    const conditionalParams = generateFilterQueryParams({
      orgName,
      orgType: searchOrgType,
    });

    resetBeforeNewSearch();

    fetchData(conditionalParams);
  };

  const searchBySelectInput = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const orgType = e.target.value;

    if (orgType === searchOrgType) {
      return;
    }

    setSearchOrgType(orgType);

    const conditionalParams = generateFilterQueryParams({
      orgName: searchOrgName,
      orgType,
    });

    resetBeforeNewSearch();

    fetchData(conditionalParams);
  };

  const pagination = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const requestedPage = parseInt(e.currentTarget.value);

    const contToken = continuationTokens[requestedPage - 1];

    refCurrentPage.current = requestedPage;

    const continuationParam = getContinuationQueryParam(contToken);

    const filterParams = generateFilterQueryParams({
      orgName: searchOrgName,
      orgType: searchOrgType,
    });

    fetchData(`${filterParams}${continuationParam}`);
  };

  const fetchData = async (queryParams: string) => {
    try {
      const page = refCurrentPage.current;
      const response = await fetch(
        `/api/organisations?page=${page}${queryParams}`,
      );

      const result = await response.json();

      if (!continuationTokens[page]) {
        continuationTokens[page] = result.continuationToken ?? '';
      }

      const ifFirstPageUpdateTotals = page === 1;
      if (ifFirstPageUpdateTotals) {
        refTotalPages.current = result.totalPages;
        refTotalRecords.current = result.totalRecords;
      }

      setStateData(result.data);
    } catch (err) {
      console.error('Failed to fetch organisations:', err);

      setError('Failed to load data');
    }
  };

  const useData = noJs ? data : stateData;

  return (
    <>
      <form method="GET" action={pagePath} className="my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SearchOrgInput
              onChangeHandler={searchByTextInput}
              value={searchOrgName}
            />
          </div>
          <div>
            <SelectOrgType
              onClickHandler={searchBySelectInput}
              defaultVal={searchOrgType}
              lang={lang}
            />
          </div>
        </div>
        <noscript>
          <button type="submit" className="mt-8 bg-green-300 px-4 py-2 rounded">
            {z({ en: 'Apply Filters', cy: 'Cymhwyso Hidlau' })}
          </button>
        </noscript>
      </form>

      {error && <Paragraph className="text-red-500">{error}</Paragraph>}

      {!error && (
        <>
          <Paragraph className="text-blue-600 font-bold text-xl">
            {refTotalRecords.current}{' '}
            {z({ en: 'organisations', cy: 'sefydliadau' })}
          </Paragraph>
          {useData?.length ? (
            <>
              <table className="w-full border-collapse" id={tableId}>
                <thead>
                  <tr className="text-left border-b font-normal bg-blue-600 text-white align-top">
                    <th className="p-3 font-normal">
                      {z({ en: 'Organisation Name', cy: "Enw'r sefydliad" })}
                    </th>
                    <th className="p-3 font-normal">
                      {z({ en: 'Organisation Type', cy: 'Math o sefydliad' })}
                    </th>
                    <th className="p-3 font-normal">
                      {z({
                        en: 'Membership code number',
                        cy: 'Rhif cod aelodaeth ',
                      })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {useData?.map((org) => (
                    <tr key={org.id} className="border-b even:bg-gray-50">
                      <td className="p-3">{org.name}</td>
                      <td className="p-3">{org.type.title}</td>
                      <td className="p-3">{org.licence_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <form method="GET" action={`${pagePath}#${tableId}`}>
                <input type="hidden" name="name" value={name} />
                <input type="hidden" name="type" value={type} />
                <div className="flex justify-between items-center p-4">
                  <Button
                    data-testid="prev-button"
                    className="disabled:opacity-0 text-magenta-700 font-semibold"
                    variant={'link'}
                    disabled={refCurrentPage.current === 1}
                    name="page"
                    value={refCurrentPage.current - 1}
                    onClick={(e) => pagination(e)}
                    iconLeft={
                      <Icon
                        type={IconType.CHEVRON_LEFT}
                        className="fill-magenta-700 [&_path]:magenta-700"
                      />
                    }
                  >
                    {z({ en: 'Previous', cy: 'Blaenorol' })}
                  </Button>

                  <span className="text-magenta-700 pr-4">
                    {z({ en: 'Page', cy: 'Tudalen' })} {refCurrentPage.current}{' '}
                    {z({ en: 'of', cy: 'o' })} {refTotalPages.current}
                  </span>

                  <Button
                    data-testid="next-button"
                    className="disabled:opacity-0 text-magenta-700 font-semibold"
                    variant={'link'}
                    disabled={refCurrentPage.current === refTotalPages.current}
                    name="page"
                    value={refCurrentPage.current + 1}
                    onClick={(e) => pagination(e)}
                    iconRight={
                      <Icon
                        type={IconType.CHEVRON_RIGHT}
                        className="fill-magenta-700 [&_path]:fill-magenta-700"
                      />
                    }
                  >
                    {z({ en: 'Next', cy: 'Nesaf' })}
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <Paragraph data-testid="no-results">
              {z({
                en: 'There are no active organisations that match your search criteria.',
                cy: "Nid oes unrhyw sefydliadau gweithredol sy'n cyd-fynd â'r hyn yr ydych yn chwilio amdano.",
              })}
            </Paragraph>
          )}
        </>
      )}
    </>
  );
};
