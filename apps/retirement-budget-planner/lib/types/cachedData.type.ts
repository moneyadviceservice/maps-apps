export type CachedPageData = {
  pageData: Record<string, string>;
};

export type CachedAdditionalData = {
  additionalFields?: {
    [key: string]: { [key: string]: number[] };
  };
};

export type CachedData = CachedPageData & CachedAdditionalData;
