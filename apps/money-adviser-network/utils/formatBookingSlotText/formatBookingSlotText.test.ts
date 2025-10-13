import { formatBookingSlotText } from './formatBookingSlotText';

describe('formatBookingSlotText', () => {
  it('should format an AM slot correctly', () => {
    const result = formatBookingSlotText(
      'Booking Slot AM - 02-12-2024',
      true,
      'en',
    );
    expect(result).toBe('Monday 2 December - 9am to 12pm');
  });

  it('should format a PM slot correctly', () => {
    const result = formatBookingSlotText(
      'Booking Slot PM - 02-12-2024',
      true,
      'en',
    );
    expect(result).toBe('Monday 2 December - 1pm to 4pm');
  });

  it('should throw an error for an invalid slot format', () => {
    const result = formatBookingSlotText('Invalid Slot Text', true, 'en');
    expect(console.error).toHaveBeenCalledWith('Invalid slot format');
    expect(result).toBe('Invalid Slot Text');
  });

  it('should throw an error for an invalid period', () => {
    const result = formatBookingSlotText(
      'Booking Slot XYZ - 02-12-2024',
      true,
      'en',
    );
    expect(console.error).toHaveBeenCalledWith('Invalid slot format');
    expect(result).toBe('Booking Slot XYZ - 02-12-2024');
  });

  it('should handle single-digit days and months correctly', () => {
    const result = formatBookingSlotText(
      'Booking Slot AM - 01-01-2024',
      true,
      'en',
    );
    expect(result).toBe('Monday 1 January - 9am to 12pm');
  });

  it('should handle a valid leap year date', () => {
    const result = formatBookingSlotText(
      'Booking Slot AM - 29-02-2024',
      true,
      'en',
    );
    expect(result).toBe('Thursday 29 February - 9am to 12pm');
  });

  it('should format slot with no availability correctly', () => {
    const result = formatBookingSlotText(
      'Booking Slot AM - 02-12-2024',
      false,
      'en',
    );
    expect(result).toBe('Monday 2 December - 9am to 12pm - No slots available');
  });

  it('should format slot with no availability in Welsh', () => {
    const result = formatBookingSlotText(
      'Booking Slot PM - 02-12-2024',
      false,
      'cy',
    );
    expect(result).toBe(
      'Dydd Llun 2 Rhagfyr - 1pm i 4pm - Dim slotiau ar gael',
    );
  });
});
