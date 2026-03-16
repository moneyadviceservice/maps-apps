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

// Array of mock payloads for different enquiry types
// Matching: https://dev.azure.com/moneyandpensionsservice/MaPS%20Digital/_wiki/wikis/MaPS-Digital.wiki/1272/React-App-Payloads-to-D365
export const mockSuccessPayloads: Array<Record<string, string | number>> = [
  // Scams
  {
    ...basePayload,
    enquiryType: 'scams',
  },
  // Pension Guidance
  {
    ...basePayload,
    kindofEnquiry: 1,
    enquiryType: 'pensions - guidance',
  },
  // Pensions Tracing
  {
    ...basePayload,
    enquiryType: 'pensions - state pension',
    kindofEnquiry: 3,
  },
  // Pensionwise Appointments
  {
    ...basePayload,
    enquiryType: 'pensions - appointments',
    kindofEnquiry: 4,
    bookingreference: 'a'.repeat(50),
  },
  // Pensions and divorce
  {
    ...basePayload,
    enquiryType: 'pensions - appointments',
    kindofEnquiry: 5,
    bookingreference: 'a'.repeat(50),
  },
  // Insurance - Other
  {
    ...basePayload,
    enquiryType: 'insurance - other',
    kindofEnquiry: 8,
  },
  // Money Management
  {
    ...basePayload,
    enquiryType: 'money management',
    kindofEnquiry: 9,
  },
  // Debt Advice
  {
    ...basePayload,
    enquiryType: 'debt advice',
    kindofEnquiry: 10,
  },
];

// Expected case references returned by mock API for each kindofEnquiry
export const EXPECTED_CASE_REFS: Record<number, string> = {
  0: 'CAS-0',
  1: 'CAS-1',
  3: 'CAS-3',
  4: 'CAS-4',
  5: 'CAS-5',
  8: 'CAS-8',
  9: 'CAS-9',
  10: 'CAS-10',
} as const;
