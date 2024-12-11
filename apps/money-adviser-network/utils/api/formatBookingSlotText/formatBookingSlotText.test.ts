import { formatBookingSlotText } from './formatBookingSlotText';

describe('formatBookingSlotText', () => {
  it('should format an AM slot correctly', () => {
    const result = formatBookingSlotText('Booking Slot AM - 02-12-2024', 'en');
    expect(result).toBe('Monday 2 December - 9am to 12pm');
  });

  it('should format a PM slot correctly', () => {
    const result = formatBookingSlotText('Booking Slot PM - 02-12-2024', 'en');
    expect(result).toBe('Monday 2 December - 1pm to 4pm');
  });

  it('should throw an error for an invalid slot format', () => {
    const result = formatBookingSlotText('Invalid Slot Text', 'en');
    expect(console.error).toHaveBeenCalledWith('Invalid slot format');
    expect(result).toBe('Invalid Slot Text');
  });

  it('should throw an error for an invalid period', () => {
    const result = formatBookingSlotText('Booking Slot XYZ - 02-12-2024', 'en');
    expect(console.error).toHaveBeenCalledWith('Invalid slot format');
    expect(result).toBe('Booking Slot XYZ - 02-12-2024');
  });

  it('should handle single-digit days and months correctly', () => {
    const result = formatBookingSlotText('Booking Slot AM - 01-01-2024', 'en');
    expect(result).toBe('Monday 1 January - 9am to 12pm');
  });

  it('should handle a valid leap year date', () => {
    const result = formatBookingSlotText('Booking Slot AM - 29-02-2024', 'en');
    expect(result).toBe('Thursday 29 February - 9am to 12pm');
  });
});
