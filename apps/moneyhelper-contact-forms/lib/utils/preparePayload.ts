import { EntryData } from '@maps-react/mhf/types';

import { FLOW_TO_ENQUIRY_MAP, FlowName } from '../constants';

export function preparePayload(
  data: EntryData,
): Record<string, string | Date | number> {
  // Convert the date of birth to a Date object
  const { day, month, year } = data;

  const yyyy = String(year);
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const dob = `${yyyy}-${mm}-${dd}`;

  // Map the flow to the enquiry type and kind of enquiry
  const flow = data.flow as FlowName;
  const enquiryMapping = FLOW_TO_ENQUIRY_MAP[flow];

  return {
    enquiryType: enquiryMapping?.enquiryType,
    firstname: data['first-name'],
    surname: data['last-name'],
    dob,
    email: data.email,
    phone: data['phone-number'],
    postcode: data['post-code'],
    bookingreference: data['booking-reference'] || '',
    enquiry: data['text-area'],
    ...(enquiryMapping?.kindofEnquiry !== undefined && {
      kindofEnquiry: enquiryMapping.kindofEnquiry,
    }),
    language: data.lang,
  };
}
