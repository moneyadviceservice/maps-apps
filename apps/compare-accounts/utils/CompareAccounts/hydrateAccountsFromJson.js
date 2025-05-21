import hydrateAccountFromJson from './hydrateAccountFromJson';

const hydrateAccountsFromJson = (json) => {
  const masSpecificAccounts = json?.items.filter(
    (account) => account.maspacsPrimaryProduct,
  );
  return masSpecificAccounts.map((j) => hydrateAccountFromJson(j));
};

export default hydrateAccountsFromJson;
