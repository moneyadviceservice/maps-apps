// Base payload for success
const basePayload: Record<string, string | number> = {
  firstname: 'Test',
  surname: 'User',
  dob: '1990-01-01',
  email: 'test@example.com',
  phone: '07123456789',
  postcode: 'SW1A 1AA',
  bookingreference: '',
  enquiry: 'a'.repeat(50),
  language: 'en',
};

export const sessionID = '550e8400-e29b-41d4-a716-446655440000';

type MockPayload = Record<string, string | number> & { id?: number };

// Array of mock payloads for different enquiry types
// Matching: https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1272/React-App-Payloads-to-D365
export const mockSuccessPayloads: Array<MockPayload> = [
  // Scams
  {
    id: 1,
    ...basePayload,
    enquiryType: 'scams',
  },
  // Pension Guidance
  {
    id: 2,
    ...basePayload,
    kindofEnquiry: 1,
    enquiryType: 'pensions - guidance',
  },
  // Pensions Tracing
  {
    id: 3,
    ...basePayload,
    enquiryType: 'pensions - state pension',
    kindofEnquiry: 3,
  },
  // Pensionwise Appointments
  {
    id: 4,
    ...basePayload,
    enquiryType: 'pensions - appointments',
    kindofEnquiry: 4,
    bookingreference: 'a'.repeat(50),
  },
  // Pensions and divorce
  {
    id: 5,
    ...basePayload,
    enquiryType: 'pensions - appointments',
    kindofEnquiry: 5,
    bookingreference: 'a'.repeat(50),
  },
  // Insurance - Other
  {
    id: 6,
    ...basePayload,
    enquiryType: 'insurance - other',
    kindofEnquiry: 8,
  },
  // Money Management
  {
    id: 7,
    ...basePayload,
    enquiryType: 'money management',
    kindofEnquiry: 9,
  },
  // Debt Advice
  {
    id: 8,
    ...basePayload,
    enquiryType: 'debt advice',
    kindofEnquiry: 10,
  },
  // MHPD
  {
    id: 9,
    ...basePayload,
    enquiryType: 'MHPD',
    kindofEnquiry: 7,
  },
  // MHPD with Session ID
  {
    id: 10,
    ...basePayload,
    enquiryType: 'MHPD',
    kindofEnquiry: 7,
    sessionID,
  },
];

// Expected case references returned by mock API for each id
export const EXPECTED_CASE_REFS: Record<number, string> = {
  1: 'CAS-0', // scams
  2: 'CAS-1', // pension-guidance
  3: 'CAS-3', // pensions-tracing
  4: 'CAS-4', // pensionwise-appointments
  5: 'CAS-5', // pensions-divorce
  6: 'CAS-8', // insurance-other
  7: 'CAS-9', // money-management
  8: 'CAS-10', // debt-advice
  9: 'CAS-7', // mhpd
  10: 'CAS-7-SID', // mhpd-with-sessionid
} as const;
