type ConditionalParams = {
  orgName?: string;
  orgType?: string;
};

export const generateFilterQueryParams = ({
  orgName,
  orgType,
}: ConditionalParams) => {
  const nameSearchParam = orgName ? `&searchQuery=${orgName}` : '';
  const typeSearchParam = orgType ? `&type=${orgType}` : '';

  return `${nameSearchParam}${typeSearchParam}`;
};
