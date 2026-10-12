import { NextApiRequest, NextApiResponse } from 'next';

import { geocodePostcode } from '../../utils/FuelFinder/api/geocodePostcode';

import handler from './submit-location';

jest.mock('../../utils/FuelFinder/api/geocodePostcode');

describe('submit-location API handler', () => {
  const mockGeocode = geocodePostcode as jest.MockedFunction<
    typeof geocodePostcode
  >;

  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  const makeRes = (): Partial<NextApiResponse> => {
    const r: Partial<NextApiResponse> = {};
    r.redirect = jest.fn().mockReturnValue(r);
    return r;
  };

  // The redirect target is the second argument to res.redirect(303, url).
  const redirectTarget = () =>
    (res.redirect as jest.Mock).mock.calls[0][1] as string;

  beforeEach(() => {
    jest.clearAllMocks();
    res = makeRes();
  });

  it('redirects with locationError=empty when input is blank', async () => {
    req = { body: { location: '   ', language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(res.redirect).toHaveBeenCalledWith(303, expect.any(String));
    expect(redirectTarget()).toContain('locationError=empty');
    expect(mockGeocode).not.toHaveBeenCalled();
  });

  it('redirects with locationError=invalid for disallowed characters without geocoding (AC2)', async () => {
    req = { body: { location: 'Belf@st', language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toContain('locationError=invalid');
    // The typed value is preserved so the field repopulates (@ -> %40).
    expect(redirectTarget()).toContain('location=Belf%40st');
    expect(mockGeocode).not.toHaveBeenCalled();
  });

  it('geocodes inputs made up only of allowed special characters', async () => {
    mockGeocode.mockResolvedValue({
      latitude: 53.8337367,
      longitude: -2.4290148,
      postcode: '!!!!!!!!!!',
    });
    req = { body: { location: '!!!!!!!!!!', language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockGeocode).toHaveBeenCalledWith('!!!!!!!!!!');
    expect(redirectTarget()).toContain('/en/results?');
    expect(redirectTarget()).toContain('lat=53.8337367');
    expect(redirectTarget()).toContain('lng=-2.4290148');
  });

  it('redirects to results with coordinates for a valid, found location (AC1)', async () => {
    mockGeocode.mockResolvedValue({
      latitude: 51.5014,
      longitude: -0.1419,
      postcode: 'St. Albans',
    });
    req = { body: { location: 'St. Albans', language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockGeocode).toHaveBeenCalledWith('St. Albans');
    expect(redirectTarget()).toContain('/en/results?');
    expect(redirectTarget()).toContain('lat=51.5014');
    expect(redirectTarget()).toContain('lng=-0.1419');
  });

  it('redirects with locationError=invalid when a permitted input is not found (AC1)', async () => {
    mockGeocode.mockResolvedValue(null);
    req = { body: { location: 'abcde', language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(mockGeocode).toHaveBeenCalledWith('abcde');
    expect(redirectTarget()).toContain('locationError=invalid');
  });

  it('forwards a valid fuelType to the results redirect', async () => {
    mockGeocode.mockResolvedValue({
      latitude: 51.5014,
      longitude: -0.1419,
      postcode: 'St. Albans',
    });
    req = {
      body: { location: 'St. Albans', language: 'en', fuelType: 'B7_STANDARD' },
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toContain('/en/results?');
    expect(redirectTarget()).toContain('fuelType=B7_STANDARD');
  });

  it('echoes fuelType on the empty-location redirect so the selection is kept', async () => {
    req = {
      body: { location: '   ', language: 'en', fuelType: 'B7_STANDARD' },
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toContain('locationError=empty');
    expect(redirectTarget()).toContain('fuelType=B7_STANDARD');
  });

  it('normalises an unrecognised fuelType to the default', async () => {
    mockGeocode.mockResolvedValue({
      latitude: 51.5014,
      longitude: -0.1419,
      postcode: 'St. Albans',
    });
    req = {
      body: { location: 'St. Albans', language: 'en', fuelType: 'ROCKET_FUEL' },
    };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toContain('/en/results?');
    expect(redirectTarget()).toContain('fuelType=E10');
  });

  it('falls back to /en when language is not a known locale (open redirect)', async () => {
    req = { body: { location: '', language: '/evil.com' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    // A raw language would produce Location: //evil.com?... which browsers
    // resolve to https://evil.com.
    expect(redirectTarget()).toBe('/en?locationError=empty&fuelType=E10');
  });

  it('redirects to the Welsh locale when language is cy', async () => {
    req = { body: { location: '   ', language: 'cy' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toBe('/cy?locationError=empty&fuelType=E10');
  });

  it('treats a repeated location field as empty instead of throwing', async () => {
    req = { body: { location: ['London', 'Leeds'], language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toContain('locationError=empty');
    expect(mockGeocode).not.toHaveBeenCalled();
  });

  it('defaults fuelType to E10 when it is not submitted', async () => {
    mockGeocode.mockResolvedValue({
      latitude: 51.5014,
      longitude: -0.1419,
      postcode: 'St. Albans',
    });
    req = { body: { location: 'St. Albans', language: 'en' } };

    await handler(req as NextApiRequest, res as NextApiResponse);

    expect(redirectTarget()).toContain('fuelType=E10');
  });
});
