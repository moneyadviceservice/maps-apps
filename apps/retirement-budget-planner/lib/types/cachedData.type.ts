export type CachedPageData = {
  pageData: Record<string, string>;
};

export type CachedAdditionalData = {
  additionalFields: {
    [key: string]: Record<string, string>;
  };
};
