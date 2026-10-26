import { AccountInfo, ConfidentialClientApplication } from '@azure/msal-node';

export async function hydrateMsal(
  msalInstance: ConfidentialClientApplication,
  parsed: { tokenCache: string; account: AccountInfo | null },
): Promise<AccountInfo | null> {
  const tokenCache = parsed.tokenCache;
  const homeAccountId = parsed.account?.homeAccountId;

  if (!tokenCache || !homeAccountId) return null;

  try {
    msalInstance.getTokenCache().deserialize(tokenCache);

    const accounts = await msalInstance.getTokenCache().getAllAccounts();
    return accounts.find((acc) => acc.homeAccountId === homeAccountId) ?? null;
  } catch {
    return null;
  }
}
