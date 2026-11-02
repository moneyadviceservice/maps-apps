import { IndividualsApiResponse } from 'types/register';
import type { Principal } from 'types/travel-insurance-firm';

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

export async function validateFirmPrincipals(
  fcaNumber: string,
  principal: Principal | null | undefined,
) {
  if (!fcaNumber || !principal) return [];

  const irn = principal.individual_reference_number;
  if (!irn || irn.trim() === '') {
    return [{ irn: 'Missing', isValid: false }];
  }

  const resultsMap = new Map<string, boolean>();
  resultsMap.set(irn, false);
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

      if (foundCount === 1) break;

      apiUrl = data.ResultInfo?.Next;
    }

    return [
      {
        irn,
        isValid: resultsMap.get(irn) ?? false,
      },
    ];
  } catch (err) {
    console.error(`Error validating principals:`, err);
    return [{ irn, isValid: false }];
  }
}
