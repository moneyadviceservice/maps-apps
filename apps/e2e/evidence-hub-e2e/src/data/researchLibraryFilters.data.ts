/**
 * AEM tag group keys and filter option keys for research library E2E tests.
 * `key` matches the filter section `data-testid` when set in AEM.
 * `label` matches the accordion title for section lookup.
 * Filter values are tag **keys** (match `data-testid="filter-{group}-{key}"`).
 */
export type FilterGroup = {
  key: string;
  label: string;
};

export const researchLibraryFilters = {
  groups: {
    pageType: { key: 'pageType', label: 'Evidence Type' },
    countryOfDelivery: {
      key: 'countryOfDelivery',
      label: 'Country',
    },
    organisation: { key: 'organisation', label: 'Organisation' },
    clientGroup: { key: 'clientGroup', label: 'Population groups' },
    topic: { key: 'topic', label: 'Topics' },
  },
  values: {
    pageType: {
      evaluation: 'evaluation',
      insight: 'insight',
    },
    countryOfDelivery: {
      england: 'england',
      scotland: 'scotland',
    },
    organisation: {
      mapsSupported: 'maps-support',
      mapsLead: 'maps-lead',
    },
    clientGroup: {
      childrenAndYoungPeople: 'children',
      workingAge: 'working-age',
    },
    topic: {
      saving: 'saving',
      debt: 'debt',
    },
  },
  year: {
    'last-2': 'last-2',
    'last-5': 'last-5',
    'more-than-5': 'more-than-5',
    all: 'all',
  },
} as const;
