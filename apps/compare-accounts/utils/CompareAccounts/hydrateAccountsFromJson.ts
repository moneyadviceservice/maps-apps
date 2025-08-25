import hydrateAccountFromJson, { Account } from './hydrateAccountFromJson';

interface JsonObject {
  [key: string]: any;
}

interface AccountsJson {
  items: JsonObject[];
}

const hydrateAccountsFromJson = (
  json: AccountsJson | null | undefined,
): Account[] => {
  const masSpecificAccounts =
    json?.items?.filter((account) => account.maspacsPrimaryProduct) || [];
  return masSpecificAccounts.map((j) => hydrateAccountFromJson(j));
};

export default hydrateAccountsFromJson;
export type { Account };
