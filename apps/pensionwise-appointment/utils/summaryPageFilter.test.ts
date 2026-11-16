import { filterInterestList, filterToDoCards } from './summaryPageFilter';
import { ToDoCard } from './types';

const mockQuery = [
  {
    query: {
      t1q1: '2',
      t1q2: '1',
      t2q1: '2',
      t2q2: '2',
      t2q3: '3',
      t3q1: '1',
      t4q1: '1',
      t5q1: '2',
      t5q2: '2',
    },
  },
  {
    query: {
      t1q1: '3',
      t1q2: '3',
      t2q1: '1',
      t2q2: '1',
      t2q3: '1',
      t3q1: '2',
      t4q1: '3',
      t5q1: '2',
      t5q2: '2',
    },
  },
];

const mockplanningToDoCards = (
  length: number,
  type: 'basic' | 'optional' = 'basic',
): ToDoCard[] => {
  return Array.from({ length: length }).map((_, index) => ({
    id: type === 'optional' ? (index + 4).toString() : (index + 1).toString(),
    title: `${type} title ${index + 1}`,
    text: {
      json: [
        {
          nodeType: 'document',
          content: [
            {
              nodeType: 'paragraph',
              content: [
                {
                  nodeType: 'text',
                  value: `${type} description ${index + 1}`,
                  marks: [],
                },
              ],
            },
          ],
        },
      ],
    },
    duration: `10 mins`,
  }));
};

const mockPensionOptions = (length: number) => {
  const options = [
    'retireLater',
    'guaranteedIncome',
    'flexibleIncome',
    'lumpSum',
    'potInOneGo',
    'mixinOptions',
  ];

  let finalOptions = {};
  for (const option of options) {
    finalOptions = {
      ...finalOptions,
      [option]: {
        testId: option,
        title: `${option} title`,
        items: mockplanningToDoCards(length),
      },
    };
  }

  return finalOptions;
};
describe('Summary page filter', () => {
  describe('Filter to do cards', () => {
    it('should filterToDOCards', () => {
      const data = filterToDoCards(
        mockQuery[0].query,
        mockplanningToDoCards(3, 'basic'),
        mockplanningToDoCards(10, 'optional'),
      );

      expect(data.length).toBe(12);
      Array.from({ length: 3 }).forEach((_, idx) => {
        expect(data[idx].title).toBe(`basic title ${idx + 1}`);
      });
    });

    it('should return part of to do card details filtered based on wuery params', () => {
      const data = filterToDoCards(
        mockQuery[1].query,
        mockplanningToDoCards(3, 'basic'),
        mockplanningToDoCards(10, 'optional'),
      );

      expect(data.length).toBe(8);
    });

    it('should return only basic to do cards when query is missing', () => {
      const data = filterToDoCards(
        {},
        mockplanningToDoCards(3, 'basic'),
        mockplanningToDoCards(10, 'optional'),
      );

      expect(data.length).toBe(3);
    });

    it('should return only basic to do cards when optional are missing', () => {
      const data = filterToDoCards(
        mockQuery[0].query,
        mockplanningToDoCards(3, 'basic'),
        [],
      );

      expect(data.length).toBe(3);
    });

    it('should return empty array if all to do cards are missing', () => {
      const data = filterToDoCards(mockQuery[0].query, [], []);

      expect(data.length).toBe(0);
    });
  });

  describe('Filter interest list', () => {
    it('should return full interest list', () => {
      const data = filterInterestList(
        {
          t6q1: '1',
          t7q1: '1',
          t8q1: '1',
          t9q1: '1',
          t10q1: '1',
          t11q1: '1',
        },
        mockPensionOptions(2),
      );

      expect(data.length).toBe(6);
    });

    it('should return only penion options that were interest to user', () => {
      const data = filterInterestList(
        {
          t6q1: '1',
          t7q1: '0',
          t8q1: '1',
          t9q1: '0',
          t10q1: '0',
          t11q1: '1',
        },
        mockPensionOptions(2),
      );

      expect(data.length).toBe(3);
    });

    it('should return empty object when query params are null', () => {
      const data = filterInterestList({}, mockPensionOptions(2));

      expect(data.length).toBe(0);
    });

    it('should return empty object when no pension options are provided', () => {
      const data = filterInterestList({}, {});

      expect(data.length).toBe(0);
    });
  });
});
