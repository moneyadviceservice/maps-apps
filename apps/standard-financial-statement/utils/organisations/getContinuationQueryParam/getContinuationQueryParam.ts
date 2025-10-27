export const getContinuationQueryParam = (continuationToken?: string) =>
  continuationToken
    ? `&continuationToken=${encodeURIComponent(continuationToken)}`
    : '';
