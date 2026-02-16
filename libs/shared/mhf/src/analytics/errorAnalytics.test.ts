import { mockErrors } from '../mocks';
import { buildErrorDetails, emitErrorEventIfAny } from './errorAnalytics';

describe('errorAnalytics', () => {
  const mockTEn = (key: string) => key;
  const mockAddEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('buildErrorDetails returns empty array when errors is undefined', () => {
    const result = buildErrorDetails({
      errors: undefined,
      step: 'contact-details',
      tEn: mockTEn,
      errorStepName: 'error',
    });

    expect(result).toEqual([]);
  });

  it('buildErrorDetails returns error-page when step matches errorStepName', () => {
    const result = buildErrorDetails({
      errors: mockErrors,
      step: 'error',
      tEn: mockTEn,
      errorStepName: 'error',
    });

    expect(result).toHaveLength(1);
    expect(result[0].reactCompName).toBe('error-page');
  });

  it('buildErrorDetails flattens form field errors', () => {
    const result = buildErrorDetails({
      errors: mockErrors,
      step: 'contact-details',
      tEn: mockTEn,
      errorStepName: 'error',
    });

    expect(result).toHaveLength(2);
  });

  it('emitErrorEventIfAny calls addEvent when errorDetails exist', () => {
    const errorDetails = [
      {
        reactCompType: 'Contact Details',
        reactCompName: 'email',
        errorMessage: 'Email is required',
      },
    ];

    emitErrorEventIfAny(mockAddEvent, errorDetails);

    expect(mockAddEvent).toHaveBeenCalledWith({
      event: 'errorMessage',
      eventInfo: { errorDetails },
    });
  });

  it('emitErrorEventIfAny does not call addEvent when errorDetails is empty', () => {
    emitErrorEventIfAny(mockAddEvent, []);

    expect(mockAddEvent).not.toHaveBeenCalled();
  });
});
