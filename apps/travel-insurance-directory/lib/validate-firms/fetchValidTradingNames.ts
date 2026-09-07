import { fetchTradingNamesForFirmFcaNumber } from 'lib/fca/fetchTradingNamesForFirm';

export const fetchValidTradingNames = async (
  fcaNumber: string,
): Promise<string[]> => {
  try {
    const frn = Number.parseInt(fcaNumber, 10);

    if (Number.isNaN(frn)) {
      console.error(`Invalid FRN format for trading names fetch: ${fcaNumber}`);
      return [];
    }

    const result = await fetchTradingNamesForFirmFcaNumber(frn);

    if (result.ok) {
      return result.names;
    } else {
      console.error(
        `Failed to fetch trading names for FRN ${fcaNumber}: ${result.error}`,
      );
      return [];
    }
  } catch (error) {
    console.error(
      `Unexpected error fetching trading names for FRN ${fcaNumber}:`,
      error,
    );
    return [];
  }
};
