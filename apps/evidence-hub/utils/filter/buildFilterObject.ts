type QueryParams = Record<string, string | string[] | undefined>;

// Helper function to add keyword filter
const addKeywordFilter = (query: QueryParams, filterObject: any) => {
  if (
    query.keyword &&
    typeof query.keyword === 'string' &&
    query.keyword.trim()
  ) {
    filterObject.title = {
      _match: {
        _logOp: 'OR',
        _expressions: [
          {
            value: query.keyword.trim(),
            _operator: 'CONTAINS',
          },
        ],
      },
    };
  }
};

// Helper function to create year filter expressions
const createYearFilterExpressions = (yearType: string, currentYear: number) => {
  switch (yearType) {
    case 'last-2':
      return [
        { value: currentYear.toString(), _operator: 'EQUALS' },
        { value: (currentYear - 1).toString(), _operator: 'EQUALS' },
      ];
    case 'last-5':
      return Array.from({ length: 5 }, (_, i) => ({
        value: (currentYear - i).toString(),
        _operator: 'EQUALS',
      }));
    case 'more-than-5':
      return [{ value: (currentYear - 5).toString(), _operator: 'LESS_THAN' }];
    default:
      return [];
  }
};

// Helper function to add year filter
const addYearFilter = (query: QueryParams, filterObject: any) => {
  if (query.year && typeof query.year === 'string' && query.year !== 'all') {
    const currentYear = new Date().getFullYear();
    const expressions = createYearFilterExpressions(query.year, currentYear);

    if (expressions.length > 0) {
      filterObject.publishDate = {
        _match: {
          _logOp: 'OR',
          _expressions: expressions,
        },
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

export const buildFilterObject = (query: QueryParams): any => {
  const filterObject: any = {};

  addKeywordFilter(query, filterObject);
  addYearFilter(query, filterObject);
  processTagFilters(query, filterObject);

  // Only add _logOp if there are actual filters
  if (Object.keys(filterObject).length > 0) {
    filterObject._logOp = 'OR';
  }

  return filterObject;
};
