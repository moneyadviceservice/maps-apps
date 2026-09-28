import { dbConnect } from 'lib/database/dbConnect';
import type { MainTravelInsuranceFirmDocument } from 'types/travel-insurance-firm';

export type FetchFirmByPrincipalEmailResult = {
  success: boolean;
  response?: MainTravelInsuranceFirmDocument;
  error?: string;
};

function toEpochMs(iso: unknown): number {
  if (typeof iso !== 'string') return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function scoreFirmRecency(firm: MainTravelInsuranceFirmDocument): number {
  return toEpochMs(firm.updated_at) || toEpochMs(firm.created_at) || 0;
}

export async function fetchFirmByPrincipalEmail(
  email: string,
): Promise<FetchFirmByPrincipalEmailResult> {
  const normalizedEmail =
    typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!normalizedEmail) {
    return { success: false, error: 'Email is required' };
  }

  try {
    const { container } = await dbConnect();

    const querySpec = {
      query: `
        SELECT * FROM c
        WHERE c.type = 'main'
          AND IS_DEFINED(c.principal)
          AND LOWER(c.principal.email_address) = @email
      `,
      parameters: [{ name: '@email', value: normalizedEmail }],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();
    const firms = (resources ?? []) as MainTravelInsuranceFirmDocument[];
    if (firms.length === 0) {
      return { success: false, error: 'Firm not found' };
    }

    const best = firms
      .slice()
      .sort((a, b) => scoreFirmRecency(b) - scoreFirmRecency(a))[0];

    return { success: true, response: best };
  } catch (error) {
    console.error('Fetch firm by email failed:', error);
    return { success: false, error: 'Failed to fetch firm data' };
  }
}
