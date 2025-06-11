import { isInOfficeHours } from './isInOfficeHours';

const mockDate = (dateString: string) => {
  const mockTime = new Date(dateString).getTime();
  jest.useFakeTimers().setSystemTime(mockTime);
};

describe('isInOfficeHours', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const testCases = [
    {
      description:
        'should return true when the time is between 9:00 AM and 3:30 PM on a weekday',
      date: '2024-11-28T10:00:00',
      expected: true,
    },
    {
      description: 'should return true exactly at 9:00 AM on a weekday',
      date: '2024-11-28T09:00:00',
      expected: true,
    },
    {
      description: 'should return true exactly at 3:30 PM on a weekday',
      date: '2024-11-28T15:30:00',
      expected: true,
    },
    {
      description:
        'should return false when the time is outside office hours on a weekday',
      date: '2024-11-28T08:59:59',
      expected: false,
    },
    {
      description: 'should return false on a Saturday',
      date: '2024-11-30T10:00:00',
      expected: false,
    },
    {
      description: 'should return false on a Sunday',
      date: '2024-12-01T10:00:00',
      expected: false,
    },
  ];

  testCases.forEach(({ description, date, expected }) => {
    it(description, () => {
      mockDate(date);
      expect(isInOfficeHours()).toBe(expected);
    });
  });
});
