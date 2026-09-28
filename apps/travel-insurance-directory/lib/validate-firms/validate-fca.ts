import { FcaFirmData } from 'types/register';

import { fetchValidTradingNames } from './fetchValidTradingNames';

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

export const baseHeaders = {
  Accept: 'application/json',
  'X-Auth-Key': FCA_API_KEY,
  'X-Auth-Email': FCA_API_EMAIL,
};

export const validateFcaNumber = async (fcaNumber: string) => {
  try {
    const fetchFirmApiUrl = `${FCA_API_BASE_URL}/Firm/${fcaNumber}`;

    const response = await fetch(fetchFirmApiUrl, {
      method: 'GET',
      headers: baseHeaders,
    });

    if (!response.ok) {
      throw new Error(`FCA API error: ${response.status}`);
    }

    const data: FcaFirmData = await response.json();

    if (!data.Data?.[0]?.FRN) {
      console.warn(`FRN ${fcaNumber} not found on FCA register.`);
      return {
        valid: false,
        firmName: 'Unknown',
        frnNumber: fcaNumber,
        tradingNames: [],
      };
    }

    const isValid = data.Data?.[0]?.Status === 'Authorised';
    let fcaTradingNames: string[] = [];

    if (isValid) {
      fcaTradingNames = (await fetchValidTradingNames(fcaNumber)) ?? [];
    }

    return {
      valid: isValid,
      firmName: data.Data[0]?.['Organisation Name'],
      frnNumber: data.Data[0].FRN,
      tradingNames: fcaTradingNames,
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
