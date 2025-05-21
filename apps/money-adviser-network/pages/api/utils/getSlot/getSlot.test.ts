import { allSubmitErrors } from '../../../../data/errors';
import { getSlot } from './getSlot';

const mockDate = (dateString: string) => {
  const mockTime = new Date(dateString).getTime();
  jest.useFakeTimers().setSystemTime(mockTime);
};

describe('getSlot', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should parse a valid rawSlot with AM slot type', () => {
    const rawSlot = 'AM - 18-12-2024';
    const result = getSlot(rawSlot);
    expect(result).toEqual({
      slotType: 'AM',
      formattedSlotDate: '18/12/2024',
    });
  });

  it('should parse a valid rawSlot with PM slot type', () => {
    const rawSlot = 'PM - 01-01-2025';
    const result = getSlot(rawSlot);
    expect(result).toEqual({
      slotType: 'PM',
      formattedSlotDate: '01/01/2025',
    });
  });

  it('should return an error for an invalid rawSlot format', () => {
    const rawSlot = 'INVALID - 12/12/2024';
    const result = getSlot(rawSlot);
    expect(result).toEqual({
      error: 'Invalid slot format',
    });
  });

  it('should handle empty rawSlot and return IMMEDIATE type with current date', () => {
    const mockDate = new Date(2024, 11, 18);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    const result = getSlot();
    expect(result).toEqual({
      slotType: 'IMMEDIATE',
      formattedSlotDate: '18/12/2024',
    });

    jest.restoreAllMocks();
  });

  it('should handle rawSlot with missing slot type', () => {
    const rawSlot = ' - 18-12-2024';
    const result = getSlot(rawSlot);
    expect(result).toEqual({
      error: 'Invalid slot format',
    });
  });

  it('should handle rawSlot with missing date', () => {
    const rawSlot = 'AM - ';
    const result = getSlot(rawSlot);
    expect(result).toEqual({
      error: 'Invalid slot format',
    });
  });

  it('should handle isOnlineFlow as true', () => {
    const result = getSlot(undefined, true);

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    expect(result).toEqual({
      slotType: 'digital',
      formattedSlotDate: `${day}/${month}/${year}`,
    });
  });

  it('should return error for IMMEDIATE type outside office hours', () => {
    mockDate('2024-11-28T08:59:59');

    const result = getSlot();
    expect(result).toEqual({
      error: allSubmitErrors.outOfOfficeHours,
    });
  });

  it('should return IMMEDIATE type outside office hours with test flag override', () => {
    mockDate('2024-12-18T08:59:59');

    const result = getSlot(undefined, undefined, true);
    expect(result).toEqual({
      slotType: 'IMMEDIATE',
      formattedSlotDate: '18/12/2024',
    });
  });
});
