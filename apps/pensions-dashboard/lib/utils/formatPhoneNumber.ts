import { PhoneNumber } from '../types';

export const formatPhoneNumber = (phoneNumber: PhoneNumber) => {
  const usageMapping: { [key: string]: string } = {
    M: 'Main telephone',
    S: 'Textphone',
    W: 'Welsh language',
    N: 'Outside UK',
    A: 'WhatsApp',
  };

  return `${usageMapping[phoneNumber.usage[0]]}: ${phoneNumber.number}`;
};
