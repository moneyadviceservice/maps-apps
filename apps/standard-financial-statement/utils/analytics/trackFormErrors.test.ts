import { AnalyticsData } from '@maps-react/hooks/useAnalytics';

import { trackFormErrors } from './trackFormErrors';

describe('trackFormErrors', () => {
  it('should call addEvent with the correct AnalyticsData structure', () => {
    const addEventMock = jest.fn();

    const errors = {
      name: ['Error - Name is required'],
      email: ['Error - Invalid email address'],
    };

    trackFormErrors(addEventMock, errors);

    expect(addEventMock).toHaveBeenCalledTimes(1);

    const expectedData: AnalyticsData = {
      event: 'errorMessage',
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'FormField',
            reactCompName: 'name',
            errorMessage: 'Name is required',
          },
          {
            reactCompType: 'FormField',
            reactCompName: 'email',
            errorMessage: 'Invalid email address',
          },
        ],
      },
    };

    expect(addEventMock).toHaveBeenCalledWith(expectedData);
  });

  it('should handle empty errors gracefully', () => {
    const addEventMock = jest.fn();
    const errors = {};

    trackFormErrors(addEventMock, errors);

    expect(addEventMock).toHaveBeenCalledWith({
      event: 'errorMessage',
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [],
      },
    });
  });

  it('should handle messages without a dash correctly', () => {
    const addEventMock = jest.fn();

    const errors = {
      password: ['Password too short'],
    };

    trackFormErrors(addEventMock, errors);

    expect(addEventMock).toHaveBeenCalledWith({
      event: 'errorMessage',
      eventInfo: {
        toolName: '',
        toolStep: '',
        stepName: '',
        errorDetails: [
          {
            reactCompType: 'FormField',
            reactCompName: 'password',
            errorMessage: 'Password too short',
          },
        ],
      },
    });
  });
});
