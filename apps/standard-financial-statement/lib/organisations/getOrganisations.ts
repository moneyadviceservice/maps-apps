import { LICENCE_STATUS_VALUES } from 'types/Organisations';

import { dbConnect } from '../database/dbConnect';

export type Props = {
  page?: string;
  itemsPerPage?: string;
  queryParams: {
    name: string;
    value: string;
  }[];
  queryOptions: {
    maxItemCount: number;
    continuationToken?: string;
  };
  searchQuery?: string;
  filterQuery?: string;
  type?: string;
  isAdmin?: boolean;
};

export const getOrganisations = async ({
  page = '1',
  itemsPerPage = '15',
  queryParams,
  queryOptions,
  searchQuery,
  filterQuery,
  type,
  isAdmin,
}: Props) => {
  const { container } = await dbConnect();

  try {
    const filters: string[] = ['1=1'];

    if (searchQuery?.length) {
      filters.push(
        '(CONTAINS(c.name, @searchQuery, true) OR TO_STRING(c.licence_number) = @searchQuery)',
      );
      queryParams.push({ name: '@searchQuery', value: searchQuery });
    }

    if (type) {
      filters.push('CONTAINS(c.type.title, @type, true)');
      queryParams.push({ name: '@type', value: type });
    }

    if (!isAdmin) {
      filters.push('(c.sfs_live = true)');
    }

    let statusFilters: Array<string> = [];

    if (filterQuery) {
      statusFilters = filterQuery.split(',').map((key, index) => {
        const paramName = `@licenceStatus${index}`;
        const value =
          LICENCE_STATUS_VALUES[key as keyof typeof LICENCE_STATUS_VALUES];
        queryParams.push({ name: paramName, value });
        return `(c.licence_status = ${paramName})`;
      });
    }

    const baseQuery = `WHERE ${filters.join(' AND ')}${
      statusFilters.length ? ` AND (${statusFilters.join(' OR ')})` : ''
    }`;

    const querySpec = {
      query: `SELECT * FROM c ${baseQuery}`,
      parameters: queryParams,
    };

    const { resources, continuation } = await container.items
      .query(querySpec, queryOptions)
      .fetchNext();

    let totalPages = 0;
    let totalRecords = 0;

    if (page === '1') {
      const countQuerySpec = {
        query: `SELECT VALUE COUNT(1) FROM c ${baseQuery}`,
        parameters: queryParams,
      };

      const { resources: countResult } = await container.items
        .query(countQuerySpec)
        .fetchAll();

      totalRecords = countResult[0] ?? 0;

      totalPages = Math.ceil(totalRecords / Number(itemsPerPage));
    }

    return {
      data: resources,
      totalPages: totalPages,
      totalRecords: totalRecords,
      continuationToken: continuation ?? null,
    };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
