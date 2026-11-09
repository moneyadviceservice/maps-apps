import { getOrganisations } from './getOrganisations';

export type OrganisationsQueryProps = {
  page?: string;
  itemsPerPage?: string;
  searchQuery?: string;
  filterQuery?: string;
  continuationToken?: string;
  type?: string;
};

export const organisations = async ({
  page = '1',
  itemsPerPage = '15',
  searchQuery,
  filterQuery,
  continuationToken,
  type,
}: OrganisationsQueryProps) => {
  try {
    const queryParams: { name: string; value: string }[] = [];
    const queryOptions: { maxItemCount: number; continuationToken?: string } = {
      maxItemCount: Number(itemsPerPage),
      ...(continuationToken && { continuationToken: continuationToken }),
    };

    return getOrganisations({
      page,
      itemsPerPage,
      queryParams,
      queryOptions,
      searchQuery,
      filterQuery,
      type,
    });
  } catch (error) {
    console.error(error);
    return { error: 'Failed to fetch data' };
  }
};
