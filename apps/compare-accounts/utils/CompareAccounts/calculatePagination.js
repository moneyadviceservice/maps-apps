const calculatePagination = ({ page, pageSize, totalItems }) => {
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
