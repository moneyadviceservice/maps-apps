import { isInOfficeHours } from './isInOfficeHours';

const mockDate = (dateString: string) => {
  const mockTime = new Date(dateString).getTime();
  jest.useFakeTimers().setSystemTime(mockTime);
};

describe('isInOfficeHours', () => {
  describe('isInOfficeHours Greenwich Mean Time (GMT)', () => {
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
        date: '2024-11-28T10:00:00Z',
        expected: true,
      },
      {
        description: 'should return true exactly at 9:00 AM on a weekday',
        date: '2024-11-28T09:00:00Z',
        expected: true,
      },
      {
        description: 'should return true exactly at 3:30 PM on a weekday',
        date: '2024-11-28T15:30:00Z',
        expected: true,
      },
      {
        description:
          'should return false when the time is outside office hours on a weekday',
        date: '2024-11-28T08:59:59Z',
        expected: false,
      },
      {
        description: 'should return false on a Saturday',
        date: '2024-11-30T10:00:00Z',
        expected: false,
      },
      {
        description: 'should return false on a Sunday',
        date: '2024-12-01T10:00:00Z',
        expected: false,
      },
    ];

    it.each(testCases)(`$description`, ({ date, expected }) => {
      mockDate(date);
      expect(isInOfficeHours()).toBe(expected);
    });
  });

  describe('isInOfficeHours during British Summer Time (BST)', () => {
    const summerTestCases = [
      {
        description:
          'should return true during BST office hours (e.g., 10:00 BST)',
        date: '2025-07-29T09:00:00Z', // 09:00 UTC is 10:00 BST
        expected: true,
      },
      {
        description:
          'should return false just before BST office hours (e.g., 8:59 BST)',
        date: '2025-07-29T07:59:59Z', // 07:59 UTC is 8:59 BST
        expected: false,
      },
      {
        description:
          'should return true at the end of BST office hours (e.g., 15:30 BST)',
        date: '2025-07-29T14:30:00Z', // 14:30 UTC is 15:30 BST
        expected: true,
      },
    ];

    it.each(summerTestCases)(`$description`, ({ date, expected }) => {
      mockDate(date);
      expect(isInOfficeHours()).toBe(expected);
    });
  });

  describe('isInOfficeHours with optional businessClosureStatus prop', () => {
    const businessDayClosed = {
      success: true,
      date: '2025-11-08',
      closed: false,
    };
    const businessDayOpen = {
      ...businessDayClosed,
      closed: true,
    };

    const businessClosureTestCases = [
      {
        description:
          'should return true when businessClosureStatus.closed = false and time is within normal business hours',
        date: '2024-11-28T10:00:00Z',
        businessClosureStatus: businessDayClosed,
        expected: true,
      },
      {
        description:
          'should return false when businessClosureStatus.closed = true regardless of time',
        date: '2024-11-28T10:00:00Z',
        businessClosureStatus: businessDayOpen,
        expected: false,
      },
    ];

    it.each(businessClosureTestCases)(
      `$description`,
      ({ date, businessClosureStatus, expected }) => {
        mockDate(date);
        expect(isInOfficeHours(businessClosureStatus)).toBe(expected);
      },
    );
  });
});
