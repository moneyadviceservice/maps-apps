interface Individual {
  Status: string;
  URL: string;
  IRN: string;
  Name: string;
}

interface ApiResponse {
  Status: string;
  ResultInfo: {
    Next?: string;
    page: string;
    per_page: string;
    total_count: string;
  };
  Data: Individual[];
}

const FCA_API_BASE_URL = process.env.FCA_API_BASE_URL ?? '';
const FCA_API_KEY = process.env.FCA_API_KEY ?? '';
const FCA_API_EMAIL = process.env.FCA_API_EMAIL ?? '';

export async function validateIRN(irn: string, fcaNumber?: string) {
  if (!fcaNumber) {
    return false;
  }
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

      if (!response.ok) {
        return false;
      }

      const data: ApiResponse = await response.json();

      if (data.Status !== 'FSR-API-02-05-00') {
        return false;
      }

      const isIrnValid = data.Data?.some(
        (individual) => individual.IRN === irn,
      );

      if (isIrnValid) {
        return isIrnValid;
      }

      apiUrl = data.ResultInfo?.Next;
    }

    return false;
  } catch (err) {
    console.error(err);

    return false;
  }
}
