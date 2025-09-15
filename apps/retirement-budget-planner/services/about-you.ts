import { Partner } from 'lib/types/aboutYou';

export const updatePartnerInformation = async (partners: Partner[]) => {
  try {
    await fetch('/api/set-partner-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partners),
    });
  } catch (error) {
    console.error('Error calling API:', error);
  }
};
