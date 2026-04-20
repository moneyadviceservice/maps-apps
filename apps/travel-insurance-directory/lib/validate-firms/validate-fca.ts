import { FcaFirmData } from 'types/register';

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

export const validateFcaNumber = async (fcaNumber: string) => {
  try {
    const apiUrl = `${FCA_API_BASE_URL}/Firm/${fcaNumber}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Auth-Key': FCA_API_KEY,
        'X-Auth-Email': FCA_API_EMAIL,
      },
    });

    if (!response.ok) {
      throw new Error(`FCA API error: ${response.status}`);
    }

    const data: FcaFirmData = await response.json();

    if (!data.Data?.[0]?.FRN) {
      throw new Error('FCA Firm Reference Number (FRN) not found');
    }

    return {
      valid: data.Data?.[0]?.Status === 'Authorised',
      firmName: data.Data[0]?.['Organisation Name'],
      frnNumber: data.Data[0].FRN,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('FCA API request timed out');
      }
    }

    console.error(error);

    throw new Error('An error occurred while validating the FCA number');
  }
};
