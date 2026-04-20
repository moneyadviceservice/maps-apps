import { IndividualsApiResponse } from 'types/register';
import { TravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

export async function validateFirmPrincipals(
  fcaNumber: string,
  databasePrincipals: TravelInsuranceFirmDocument['principals'],
) {
  if (!fcaNumber || !databasePrincipals?.length) return [];

  const resultsMap = new Map<string, boolean>();
  let totalToFind = 0;

  databasePrincipals.forEach((p) => {
    const irn = p.individual_reference_number;

    if (!irn || irn.trim() === '') {
      resultsMap.set(`MISSING_${Math.random()}`, false);
    } else {
      resultsMap.set(irn, false);
      totalToFind++;
    }
  });

  if (totalToFind === 0) {
    return databasePrincipals.map((p) => ({
      irn:
        p.individual_reference_number === '' ||
        p.individual_reference_number === undefined
          ? 'Missing'
          : p.individual_reference_number,
      isValid: false,
    }));
  }

  let foundCount = 0;
  const initialUrl = `${FCA_API_BASE_URL}/Firm/${fcaNumber}/Individuals`;

  try {
    let apiUrl: string | undefined = initialUrl;

    while (apiUrl) {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Auth-Key': FCA_API_KEY,
          'X-Auth-Email': FCA_API_EMAIL,
        },
      });

      if (!response.ok) break;
      const data: IndividualsApiResponse = await response.json();
      if (data.Status !== 'FSR-API-02-05-00') break;

      data.Data?.forEach((individual) => {
        if (
          resultsMap.has(individual.IRN) &&
          resultsMap.get(individual.IRN) === false
        ) {
          resultsMap.set(individual.IRN, true);
          foundCount++;
        }
      });

      if (foundCount === totalToFind) break;

      apiUrl = data.ResultInfo?.Next;
    }

    return databasePrincipals.map((p) => {
      const irn = p.individual_reference_number;
      return {
        irn: irn ?? 'N/A',
        isValid: irn ? resultsMap.get(irn) ?? false : false,
      };
    });
  } catch (err) {
    console.error(`Error validating principals:`, err);
    return databasePrincipals.map((p) => ({
      irn: p.individual_reference_number ?? 'N/A',
      isValid: false,
    }));
  }
}
