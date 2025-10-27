type QueryParams = Record<string, string | string[] | undefined>;

// Helper function to add keyword filter
const addKeywordFilter = (query: QueryParams, filterObject: any) => {
  if (
    query.keyword &&
    typeof query.keyword === 'string' &&
    query.keyword.trim()
  ) {
    filterObject.searchKeywords = {
      _expressions: {
        value: query.keyword.trim(),
        _operator: 'CONTAINS',
      },
    };
  }
};

// Helper function to create year filter expressions
const createYearFilterExpressions = (yearType: string) => {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  switch (yearType) {
    case 'last-2': {
      const twoYearsAgo = new Date(today);
      twoYearsAgo.setFullYear(today.getFullYear() - 1);
      twoYearsAgo.setMonth(0, 1); // January 1st
      return [
        {
          value: twoYearsAgo.toISOString().split('T')[0],
          _operator: 'AT_OR_AFTER',
        },
        { value: todayString, _operator: 'AT_OR_BEFORE' },
      ];
    }
    case 'last-5': {
      const fiveYearsAgo = new Date(today);
      fiveYearsAgo.setFullYear(today.getFullYear() - 4);
      fiveYearsAgo.setMonth(0, 1); // January 1st
      return [
        {
          value: fiveYearsAgo.toISOString().split('T')[0],
          _operator: 'AT_OR_AFTER',
        },
        { value: todayString, _operator: 'AT_OR_BEFORE' },
      ];
    }
    case 'more-than-5': {
      const moreThanFiveYearsAgo = new Date(today);
      moreThanFiveYearsAgo.setFullYear(today.getFullYear() - 5);
      return [
        {
          value: moreThanFiveYearsAgo.toISOString().split('T')[0],
          _operator: 'AT_OR_BEFORE',
        },
      ];
    }
    default:
      return [];
  }
};

// Helper function to add year filter
const addYearFilter = (query: QueryParams, filterObject: any) => {
  if (query.year && typeof query.year === 'string' && query.year !== 'all') {
    const expressions = createYearFilterExpressions(query.year);

    if (expressions.length > 0) {
      filterObject.publishDate = {
        _logOp: 'AND',
        _expressions: expressions,
      };
    }
  }
};

// Helper function to parse tag values
const parseTagValues = (tagValues: string | string[]): string[] => {
  if (Array.isArray(tagValues)) {
    return tagValues;
  }

  return tagValues.includes(',')
    ? tagValues.split(',').map((v) => v.trim())
    : [tagValues];
};

// Helper function to create tag filter expressions
const createTagFilterExpressions = (values: string[]) => {
  return values.map((value) => ({
    value: value.trim(),
    _operator: 'EQUALS',
  }));
};

// Helper function to add tag filter
const addTagFilter = (key: string, values: string[], filterObject: any) => {
  const fieldMapping: Record<string, string> = {
    topics: 'topic',
    'client group': 'clientGroup',
    'measured outcomes': 'measuredOutcomes',
    'evidence type': 'pageType',
  };

  const aemFieldName = fieldMapping[key] || key;
  const expressions = createTagFilterExpressions(values);

  if (aemFieldName === 'pageType') {
    filterObject[aemFieldName] = {
      key: {
        _logOp: 'OR',
        _expressions: expressions,
      },
    };
  } else {
    filterObject[aemFieldName] = {
      _match: {
        _logOp: 'OR',
        key: {
          _logOp: 'OR',
          _expressions: expressions,
        },
      },
    };
  }
};

// Helper function to process tag filters
const processTagFilters = (query: QueryParams, filterObject: any) => {
  Object.keys(query).forEach((key) => {
    // Skip language-related parameters and non-tag parameters
    if (
      key === 'lang' ||
      key === 'language' ||
      key === 'keyword' ||
      key === 'year'
    ) {
      return;
    }

    const isTagArray = key.endsWith('[]');
    const isTagGroup = !key.includes('[]');

    if (isTagArray || isTagGroup) {
      const tagGroupName = key.replace('[]', '');
      const tagValues = query[key];

      if (tagValues) {
        const values = parseTagValues(tagValues);
        const filteredValues = values.filter(
          (value) => value && value.trim() !== '',
        );

        if (filteredValues.length > 0) {
          addTagFilter(tagGroupName, filteredValues, filterObject);
        }
      }
    }
  });
};

export const buildFilterObject = (query: QueryParams) => {
  const filterObject: any = {};

  addKeywordFilter(query, filterObject);
  addYearFilter(query, filterObject);
  processTagFilters(query, filterObject);

  // Only add _logOp if there are actual filters
  if (Object.keys(filterObject).length > 0) {
    filterObject._logOp = 'AND';
  }

  return filterObject;
};
