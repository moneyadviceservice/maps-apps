import { PhoneNumber } from '../types';

const usageMapping: { [key: string]: string } = {
  M: 'Main telephone',
  S: 'Textphone',
  W: 'Welsh language',
  N: 'Outside UK',
  A: 'WhatsApp',
};

export const formatPhoneNumber = (phoneNumber: PhoneNumber) => {
  return `${usageMapping[phoneNumber.usage[0]]}: ${phoneNumber.number}`;
};
