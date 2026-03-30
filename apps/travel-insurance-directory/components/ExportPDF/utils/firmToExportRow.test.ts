import type {
  Office,
  TravelInsuranceFirmDocument,
} from 'types/travel-insurance-firm';

import { firmToExportRow } from './firmToExportRow';

const makeOffice = (contact: Office['contact']): Office => ({
  address: {} as Office['address'],
  contact,
  location: {} as Office['location'],
  disabled_access: false,
  opening_times: [],
  created_at: '',
  updated_at: '',
});

const makeFirm = (
  overrides: Partial<TravelInsuranceFirmDocument>,
): TravelInsuranceFirmDocument =>
  ({
    fca_number: 1,
    registered_name: 'Test Firm',
    website_address: null,
    offices: [],
    approved_at: null,
    created_at: '',
    updated_at: '',
    hidden_at: null,
    reregistered_at: null,
    reregister_approved_at: null,
    confirmed_disclaimer: false,
    status: 'active' as const,
    covered_by_ombudsman_question: null,
    ...overrides,
  } as TravelInsuranceFirmDocument);

describe('firmToExportRow', () => {
  it('maps registered_name, website_address, and first office contact to row', () => {
    const firm = makeFirm({
      fca_number: 123456,
      registered_name: 'Test Firm Ltd',
      website_address: 'https://example.com',
      offices: [
        makeOffice({
          telephone_number: '020 1234 5678',
          email_address: 'contact@example.com',
          website: 'https://office.example.com',
        }),
      ],
    });

    expect(firmToExportRow(firm)).toEqual({
      name: 'Test Firm Ltd',
      website: 'https://example.com',
      phone: '020 1234 5678',
      email: 'contact@example.com',
    });
  });

  it('uses first office contact when website_address is null', () => {
    const firm = makeFirm({
      registered_name: 'Firm',
      offices: [
        makeOffice({
          telephone_number: '0111 222 333',
          email_address: 'info@firm.com',
          website: 'https://firm.com',
        }),
      ],
    });

    expect(firmToExportRow(firm).website).toBe('https://firm.com');
  });

  it('returns empty strings when no offices or contact', () => {
    const firm = makeFirm({ registered_name: 'No Contact Firm' });

    expect(firmToExportRow(firm)).toEqual({
      name: 'No Contact Firm',
      website: '',
      phone: '',
      email: '',
    });
  });
});
