import { createMockFirm } from 'components/FirmSummary/mockFirm';
import type { Office } from 'types/travel-insurance-firm';

import { firmToExportRow } from './firmToExportRow';

const makeOffice = (contact: Office['contact']): Office => ({
  address: {
    line_one: null,
    line_two: null,
    town: null,
    county: null,
    postcode: null,
  },
  contact,
  location: { latitude: null, longitude: null },
  disabled_access: false,
  opening_times: {},
  created_at: '',
  updated_at: '',
});

describe('firmToExportRow', () => {
  it('maps registered_name, website_address, and office contact to row', () => {
    const firm = createMockFirm({
      registered_name: 'Test Firm Ltd',
      website_address: 'https://example.com',
      office: makeOffice({
        telephone_number: '020 1234 5678',
        email_address: 'contact@example.com',
        website: 'https://office.example.com',
      }),
    });

    expect(firmToExportRow(firm)).toEqual({
      name: 'Test Firm Ltd',
      website: 'https://example.com',
      phone: '020 1234 5678',
      email: 'contact@example.com',
    });
  });

  it('uses office contact website when website_address is null', () => {
    const firm = createMockFirm({
      registered_name: 'Firm',
      website_address: null,
      office: makeOffice({
        telephone_number: '0111 222 333',
        email_address: 'info@firm.com',
        website: 'https://firm.com',
      }),
    });

    expect(firmToExportRow(firm).website).toBe('https://firm.com');
  });

  it('returns empty strings when no office or contact', () => {
    const firm = createMockFirm({
      registered_name: 'No Contact Firm',
      website_address: null,
      office: null,
    });

    expect(firmToExportRow(firm)).toEqual({
      name: 'No Contact Firm',
      website: '',
      phone: '',
      email: '',
    });
  });
});
