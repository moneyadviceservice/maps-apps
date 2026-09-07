import { DateRange, DateRangeOption, getDateRange } from './dateRangeUtils';
import {
  determineDefaultOrder,
  extractKeyword,
  parseQueryParam,
  QueryParams,
  SortOrder,
} from '../query/queryHelpers';
import { SlimDocument } from '../fetch/documentsCacheTypes';

export interface FilterConfig {
  pageType?: string[];
  year?: DateRangeOption;
  countryOfDelivery?: string[];
  topic?: string[];
  clientGroup?: string[];
  organisation?: string[];
  keyword?: string;
  order?: SortOrder;
}

type FilterFunction = (docs: SlimDocument[]) => SlimDocument[];

function hasMatchingTags(
  tags: Array<{ key?: string; name?: string }> | undefined,
  selectedValues: string[],
): boolean {
  if (!Array.isArray(tags) || selectedValues.length === 0) {
    return false;
  }

  return selectedValues.some((value) =>
    tags.some((tag) => tag.key === value || tag.name === value),
  );
}

function createPageTypeFilter(pageTypes: string[]): FilterFunction {
  if (pageTypes.length === 0) return (docs) => docs;

  return (docs) =>
    docs.filter(
      (doc) => doc.pageType?.key && pageTypes.includes(doc.pageType.key),
    );
}

function createDateRangeFilter(dateRange: DateRange | null): FilterFunction {
  if (!dateRange) return (docs) => docs;

  const { startDate, endDate } = dateRange;

  return (docs) =>
    docs.filter((doc) => {
      if (!doc.publishDate) return false;
      const docDate = new Date(doc.publishDate);
      return docDate >= startDate && docDate <= endDate;
    });
}

function createOrFilter(
  filters: Record<string, string[]>,
  filterKeys: string[],
): FilterFunction {
  const activeFilters = Object.entries(filters).filter(
    ([key, values]) => filterKeys.includes(key) && values.length > 0,
  );

  if (activeFilters.length === 0) return (docs) => docs;

  const propertyMap: Record<string, keyof SlimDocument> = {
    countryOfDelivery: 'countryOfDelivery',
    topic: 'topic',
    clientGroup: 'clientGroup',
    organisation: 'organisation',
  };

  return (docs) =>
    docs.filter((doc) =>
      activeFilters.some(([key, values]) => {
        const propertyName = propertyMap[key];
        if (!propertyName) return false;

        const tags = doc[propertyName] as
          | Array<{
              key?: string;
              name?: string;
            }>
          | undefined;
        return hasMatchingTags(tags, values);
      }),
    );
}

export function parseQueryToFilters(query: QueryParams): FilterConfig {
  const keyword = extractKeyword(query);
  const order = determineDefaultOrder(keyword, query.order);

  return {
    pageType: parseQueryParam(query.pageType),
    year: (query.year || query.publishDate) as DateRangeOption,
    countryOfDelivery: parseQueryParam(query.countryOfDelivery),
    topic: parseQueryParam(query.topic),
    clientGroup: parseQueryParam(query.clientGroup),
    organisation: parseQueryParam(query.organisation),
    keyword,
    order,
  };
}

export function buildFilterPipeline(config: FilterConfig): FilterFunction {
  const filters: FilterFunction[] = [];

  if (config.pageType?.length) {
    filters.push(createPageTypeFilter(config.pageType));
  }

  if (config.year && config.year !== 'all') {
    const dateRange = getDateRange(config.year);
    if (dateRange) {
      filters.push(createDateRangeFilter(dateRange));
    }
  }

  const orFilterValues = {
    countryOfDelivery: config.countryOfDelivery || [],
    topic: config.topic || [],
    clientGroup: config.clientGroup || [],
    organisation: config.organisation || [],
  };

  const hasOrFilters = Object.values(orFilterValues).some((v) => v.length > 0);
  if (hasOrFilters) {
    filters.push(
      createOrFilter(orFilterValues, [
        'countryOfDelivery',
        'topic',
        'clientGroup',
        'organisation',
      ]),
    );
  }

  if (filters.length === 0) {
    return (docs) => docs;
  }

  return (documents) =>
    filters.reduce((docs, filter) => filter(docs), documents);
}
