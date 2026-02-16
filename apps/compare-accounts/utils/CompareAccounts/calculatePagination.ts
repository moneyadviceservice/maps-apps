interface PaginationParams {
  page: number;
  pageSize?: number;
  totalItems: number;
}

interface PaginationResult {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  nextPage: number;
  previousPage: number;
  previousEnabled: boolean;
  nextEnabled: boolean;
}

const calculatePagination = ({
  page,
  pageSize,
  totalItems,
}: PaginationParams): PaginationResult => {
  pageSize = pageSize || 10;

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    pageSize,
    totalItems,

    totalPages,

    startIndex: pageSize * (page - 1),
    endIndex: pageSize * (page - 1) + pageSize,

    nextPage: page + 1,
    previousPage: page - 1,

    previousEnabled: page > 1,
    nextEnabled: page < totalPages,
  };
};

export default calculatePagination;
