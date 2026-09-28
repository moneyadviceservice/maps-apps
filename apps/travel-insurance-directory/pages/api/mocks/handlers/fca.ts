import { http, HttpResponse } from 'msw';

import { selfServeE2eConstants } from 'lib/ci/selfServeE2eConstants';

const FCA_API_BASE_URL =
  process.env.FCA_API_BASE_URL ?? 'https://api.fca.org.uk';

const e2eTradingNamesPayload = selfServeE2eConstants.tradingNames.map(
  (name) => ({
    Name: name,
    Status: 'Trading',
    'Effective From': '2020-01-01',
  }),
);

export const fcaHandlers = [
  http.get(`${FCA_API_BASE_URL}/Firm/:fcaNumber/Individuals`, () => {
    // FCA Validation will return false for any IRN numbers not listed here
    return HttpResponse.json({
      Status: 'FSR-API-02-05-00',
      ResultInfo: {
        page: '1',
        per_page: '1',
        total_count: '1',
      },
      Message: 'Ok. Individual found',
      Data: [
        {
          'Disciplinary History':
            'https://register.fca.org.uk/services/V0.1/Individuals/REF00001/DisciplinaryHistory',
          'Current roles & activities':
            'https://register.fca.org.uk/services/V0.1/Individuals/REF00001/CF',
          IRN: 'REF00001', // Only include the VALID test IRN
          'Commonly Used Name': 'Richard',
          Status: 'Approved by regulator',
          'Full Name': 'Tester Joe Bloggs',
        },
      ],
    });
  }),

  http.get(`${FCA_API_BASE_URL}/Firm/:fcaNumber/Names`, ({ params }) => {
    const { fcaNumber } = params;

    if (fcaNumber === selfServeE2eConstants.fcaNumberString) {
      return HttpResponse.json({
        Status: 'FSR-API-02-02-00',
        ResultInfo: { Next: null },
        Message: 'Ok. Names found',
        Data: [{ 'Current Names': e2eTradingNamesPayload }],
      });
    }

    return HttpResponse.json({
      Status: 'FSR-API-02-02-00',
      ResultInfo: { Next: null },
      Message: 'Ok. Names found',
      Data: [{ 'Current Names': [] }],
    });
  }),

  http.get(`${FCA_API_BASE_URL}/Firm/:fcaNumber`, ({ params }) => {
    const { fcaNumber } = params;

    if (fcaNumber === selfServeE2eConstants.fcaNumberString) {
      return HttpResponse.json({
        Data: [
          {
            FRN: selfServeE2eConstants.fcaNumberString,
            firmName: selfServeE2eConstants.registeredName,
            Status: 'Authorised',
          },
        ],
      });
    }

    // 1. Mock "Not Found" / Empty Record
    if (fcaNumber === '404404') {
      return HttpResponse.json({
        Status: 'FSR-API-02-01-11',
        ResultInfo: null,
        Message: 'Firm not found',
        Data: null,
      });
    }

    // 2. Mock "Not Authorised" Status
    if (fcaNumber === '111111') {
      return HttpResponse.json({
        Data: [
          {
            FRN: '111111',
            firmName: 'Unauthorised Firm Ltd',
            Status: 'Withdrawn', // This triggers your 400 error logic
          },
        ],
      });
    }

    // 3. Mock Server Error
    if (fcaNumber === '500500') {
      return new HttpResponse(null, { status: 500 });
    }

    // 4. Success Case (Default)
    return HttpResponse.json({
      Data: [
        {
          FRN: fcaNumber,
          firmName: 'Mock Authorized Financial Group',
          Status: 'Authorised',
        },
      ],
    });
  }),
];
