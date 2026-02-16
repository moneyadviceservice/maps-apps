import { FLOW_TO_ENQUIRY_MAP, FlowName } from '../constants';
import { preparePayload } from './preparePayload';

const mockData = {
  flow: FlowName.APPOINTMENT_PENSION_WISE,
  'first-name': 'John',
  'last-name': 'Doe',
  day: '15',
  month: '3',
  year: '1985',
  email: 'mock@email.com',
  'phone-number': '1234567890',
  'post-code': 'AB12 3CD',
  'booking-reference': 'BR12345',
  'text-area':
    'consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.',
  lang: 'en',
};

describe('preparePayload', () => {
  it('returns correct payload with kindofEnquiry when mapping exists', () => {
    const payload = preparePayload(mockData);

    expect(payload).toMatchObject({
      enquiryType:
        FLOW_TO_ENQUIRY_MAP[FlowName.APPOINTMENT_PENSION_WISE].enquiryType,
      kindofEnquiry:
        FLOW_TO_ENQUIRY_MAP[FlowName.APPOINTMENT_PENSION_WISE].kindofEnquiry,
      firstname: mockData['first-name'],
      surname: mockData['last-name'],
      dob: '1985-03-15',
      email: mockData.email,
      phone: mockData['phone-number'],
      postcode: mockData['post-code'],
      bookingreference: mockData['booking-reference'],
      enquiry: mockData['text-area'],
      language: mockData.lang,
    });
  });

  it('omits kindofEnquiry when not in mapping', () => {
    const payload = preparePayload({ ...mockData, flow: FlowName.SCAMS });

    expect(payload).toMatchObject({
      enquiryType: FLOW_TO_ENQUIRY_MAP[FlowName.SCAMS].enquiryType,
      firstname: mockData['first-name'],
      surname: mockData['last-name'],
      dob: '1985-03-15',
      email: mockData.email,
      phone: mockData['phone-number'],
      postcode: mockData['post-code'],
      bookingreference: mockData['booking-reference'],
      enquiry: mockData['text-area'],
      language: mockData.lang,
    });
    expect(payload).not.toHaveProperty('kindofEnquiry');
  });
  it('sets an empty string for bookingreference if not provided', () => {
    const dataWithoutBookingRef = { ...mockData, 'booking-reference': '' };
    const payload = preparePayload(dataWithoutBookingRef);

    expect(payload.bookingreference).toBe('');
  });
});
