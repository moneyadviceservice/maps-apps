import { EntryData } from '@maps-react/mhf/types';
import { asString } from '@maps-react/mhf/utils';

import { FLOW_TO_ENQUIRY_MAP } from '../constants';

export function preparePayload(
  data: EntryData,
): Record<string, string | Date | number> {
  // Convert the date of birth to a Date object
  const day = asString(data.day);
  const month = asString(data.month);
  const year = asString(data.year);

  const yyyy = String(year);
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const dob = `${yyyy}-${mm}-${dd}`;

  // Map the flow to the enquiry type and kind of enquiry
  const flow = data.flow;
  const enquiryMapping = FLOW_TO_ENQUIRY_MAP[flow];
  if (!flow || !enquiryMapping) {
    throw new Error(`Invalid or missing flow: ${data.flow}`);
  }

  return {
    enquiryType: enquiryMapping?.enquiryType,
    firstname: asString(data['first-name']),
    surname: asString(data['last-name']),
    dob,
    email: asString(data.email),
    phone: asString(data['phone-number']),
    postcode: asString(data['post-code']),
    bookingreference: asString(data['booking-reference']),
    enquiry: asString(data['text-area']),
    ...(enquiryMapping?.kindofEnquiry !== undefined && {
      kindofEnquiry: enquiryMapping.kindofEnquiry,
    }),
    ...(data.sessionID && { sessionID: asString(data.sessionID) }),
    language: asString(data.locale),
  };
}
