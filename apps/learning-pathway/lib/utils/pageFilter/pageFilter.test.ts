import { GroupedTag, TagModel } from 'lib/types/site.type';

import {
  filterTags,
  getQueryParamValue,
  normalizeDate,
  orderTags,
} from './pageFilter';

describe('pageFilter', () => {
  describe('filterTags', () => {
    const pageTags: TagModel[] = [
      {
        tagCategory: {
          categoryTitleEn: 'Type of learning',
          categoryTitleCy: 'Math o ddysgu',
          categoryKey: 'type-of-learning',
          order: 2,
        },
        titleEn: 'Training',
        titleCy: 'Hyfforddiant',
        value: 'training',
      },
      {
        tagCategory: {
          categoryTitleEn: 'Country',
          categoryTitleCy: 'Gwlad',
          categoryKey: 'country',
          order: 1,
        },
        titleEn: 'England',
        titleCy: 'Cymru',
        value: 'england',
      },
      {
        tagCategory: {
          categoryTitleEn: 'Type of learning',
          categoryTitleCy: 'Math o ddysgu',
          categoryKey: 'type-of-learning',
          order: 2,
        },
        titleEn: 'Qualification',
        titleCy: 'Cymhwyster',
        value: 'qualification',
      },
    ];

    it('groups tags by category key and keeps item order for English locale', () => {
      expect(filterTags(pageTags, 'en')).toEqual([
        {
          group: 'Type of learning',
          key: 'type-of-learning',
          order: 2,
          tags: [
            { value: 'training', label: 'Training' },
            { value: 'qualification', label: 'Qualification' },
          ],
          checked: [],
        },
        {
          group: 'Country',
          key: 'country',
          order: 1,
          tags: [{ value: 'england', label: 'England' }],
          checked: [],
        },
      ]);
    });

    it('uses Welsh titles when locale is not English', () => {
      expect(filterTags(pageTags, 'cy')).toEqual([
        {
          group: 'Type of learning',
          key: 'type-of-learning',
          order: 2,
          tags: [
            { value: 'training', label: 'Hyfforddiant' },
            { value: 'qualification', label: 'Cymhwyster' },
          ],
          checked: [],
        },
        {
          group: 'Country',
          key: 'country',
          order: 1,
          tags: [{ value: 'england', label: 'Cymru' }],
          checked: [],
        },
      ]);
    });

    it('returns an empty array for undefined tags input', () => {
      expect(filterTags(undefined as unknown as TagModel[], 'en')).toEqual([]);
    });

    it('returns an empty array for empty tags input', () => {
      expect(filterTags([], 'en')).toEqual([]);
    });

    it('marks checked values when creating a new group', () => {
      const tags: TagModel[] = [
        {
          tagCategory: {
            categoryTitleEn: 'Country',
            categoryTitleCy: 'Gwlad',
            categoryKey: 'country',
            order: 1,
          },
          titleEn: 'England',
          titleCy: 'Cymru',
          value: 'england',
          isChecked: true,
        },
      ];

      expect(filterTags(tags, 'en')).toEqual([
        {
          group: 'Country',
          key: 'country',
          order: 1,
          tags: [{ value: 'england', label: 'England' }],
          checked: ['england'],
        },
      ]);
    });

    it('appends checked values when adding to an existing group', () => {
      const tags: TagModel[] = [
        {
          tagCategory: {
            categoryTitleEn: 'Type of learning',
            categoryTitleCy: 'Math o ddysgu',
            categoryKey: 'type-of-learning',
            order: 2,
          },
          titleEn: 'Training',
          titleCy: 'Hyfforddiant',
          value: 'training',
          isChecked: true,
        },
        {
          tagCategory: {
            categoryTitleEn: 'Type of learning',
            categoryTitleCy: 'Math o ddysgu',
            categoryKey: 'type-of-learning',
            order: 2,
          },
          titleEn: 'Qualification',
          titleCy: 'Cymhwyster',
          value: 'qualification',
          isChecked: true,
        },
      ];

      expect(filterTags(tags, 'en')).toEqual([
        {
          group: 'Type of learning',
          key: 'type-of-learning',
          order: 2,
          tags: [
            { value: 'training', label: 'Training' },
            { value: 'qualification', label: 'Qualification' },
          ],
          checked: ['training', 'qualification'],
        },
      ]);
    });
  });

  describe('orderTags', () => {
    it('sorts tag groups by order ascending without mutating the input', () => {
      const groups: GroupedTag[] = [
        {
          group: 'Type of learning',
          key: 'type-of-learning',
          order: 2,
          tags: [{ value: 'training', label: 'Training' }],
        },
        {
          group: 'Country',
          key: 'country',
          order: 1,
          tags: [{ value: 'england', label: 'England' }],
        },
      ];

      const sortedGroups = orderTags(groups);

      expect(sortedGroups.map((group) => group.key)).toEqual([
        'country',
        'type-of-learning',
      ]);
      expect(groups.map((group) => group.key)).toEqual([
        'type-of-learning',
        'country',
      ]);
    });

    it('should return an emtpy array if tagGroups is an empty array', () => {
      const groups: GroupedTag[] = [];
      const sortedGroups = orderTags(groups);
      expect(sortedGroups).toHaveLength(0);
    });
  });

  describe('getQueryParamValue', () => {
    it('should return a string when param is a string', () => {
      expect(getQueryParamValue('search')).toEqual('search');
    });

    it('should return the first element if param is an array', () => {
      expect(getQueryParamValue(['filter', 'search'])).toEqual('filter');
    });

    it('should return the default value if param is empty', () => {
      expect(getQueryParamValue(undefined, 'search')).toEqual('search');
    });

    it('should return undefined when param is empty and no default is provided', () => {
      expect(getQueryParamValue(undefined)).toBeUndefined();
    });
  });

  describe('normalizeDate', () => {
    it('formats a full ISO date string as DD/MM/YYYY', () => {
      expect(normalizeDate('2024-03-15T00:00:00.000Z')).toBe('15/3/2024');
    });

    it('formats a date-only string as DD/MM/YYYY', () => {
      expect(normalizeDate('2024-01-05')).toBe('05/1/2024');
    });

    it('formats the first day of a year correctly', () => {
      expect(normalizeDate('2023-01-01')).toBe('01/1/2023');
    });

    it('formats the last day of a year correctly', () => {
      expect(normalizeDate('2023-12-31')).toBe('31/12/2023');
    });
  });
});
