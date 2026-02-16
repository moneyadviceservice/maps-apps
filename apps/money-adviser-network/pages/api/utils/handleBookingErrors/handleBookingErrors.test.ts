import { NextApiResponse } from 'next';

import { PAGES } from '../../../../CONSTANTS';
import { allSubmitErrors } from '../../../../data/errors';
import { handleBookingErrors } from './handleBookingErrors';

describe('handleBookingErrors', () => {
  let mockRes: Partial<NextApiResponse>;

  beforeEach(() => {
    mockRes = {
      redirect: jest.fn(),
    };
  });

  it('redirects to /t-8 when error is NoSlotForDate', () => {
    const parsedUrlData = { key1: 'value1', key2: 'value2' };
    const path = 'booking';

    handleBookingErrors(
      allSubmitErrors.NoSlotForDate,
      mockRes as NextApiResponse,
      path,
      parsedUrlData,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(
      302,
      '/booking/t-8?key1=value1&key2=value2',
    );
  });

  it('redirects to /t-9 when error is outOfOfficeHours', () => {
    const parsedUrlData = { key1: 'value1', key2: 'value2' };
    const path = 'booking';

    handleBookingErrors(
      allSubmitErrors.outOfOfficeHours,
      mockRes as NextApiResponse,
      path,
      parsedUrlData,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(
      302,
      '/booking/t-9?key1=value1&key2=value2',
    );
  });

  it('redirects to confirm answers with error in query string for unhandled errors', () => {
    const parsedUrlData = { key1: 'value1', key2: 'value2' };
    const path = 'booking';

    handleBookingErrors(
      'unknownError',
      mockRes as NextApiResponse,
      path,
      parsedUrlData,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(
      302,
      `/booking/${PAGES.CONFIRM_ANSWERS}?key1=value1&key2=value2&error=unknownError`,
    );
  });

  it('handles empty parsedUrlData gracefully', () => {
    const parsedUrlData = {};
    const path = 'booking';

    handleBookingErrors(
      allSubmitErrors.NoSlotForDate,
      mockRes as NextApiResponse,
      path,
      parsedUrlData,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(302, '/booking/t-8?');
  });

  it('encodes query parameters correctly', () => {
    const parsedUrlData = { key: 'value' };
    const path = 'booking';

    handleBookingErrors(
      allSubmitErrors.capacityFull,
      mockRes as NextApiResponse,
      path,
      parsedUrlData,
    );

    expect(mockRes.redirect).toHaveBeenCalledWith(
      302,
      '/booking/t-8?key=value',
    );
  });
});
