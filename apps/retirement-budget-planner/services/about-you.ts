import { Partner } from 'lib/types/aboutYou';

export const updatePartnerInformation = async (
  partners: Partner[],
  sessionId: string,
) => {
  try {
    await fetch('/api/set-partner-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ partners, sessionId }),
    });
  } catch (error) {
    console.error('Error calling API:', error);
  }
};
