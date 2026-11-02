interface AccountType {
  nameInDefaqtoAPI: string;
  label: string;
}

const accountTypes: AccountType[] = [
  {
    nameInDefaqtoAPI: 'standard',
    label: 'standardCurrent',
  },
  {
    nameInDefaqtoAPI: 'fee free basic account',
    label: 'feeFreeBasicBank',
  },
  {
    nameInDefaqtoAPI: 'Student',
    label: 'student',
  },
  {
    nameInDefaqtoAPI: 'premier',
    label: 'premier',
  },
  {
    nameInDefaqtoAPI: 'e-money account',
    label: 'eMoney',
  },
  {
    nameInDefaqtoAPI: 'added value',
    label: 'packaged',
  },
  {
    nameInDefaqtoAPI: 'young person',
    label: 'childrenYoungPerson',
  },
  {
    nameInDefaqtoAPI: 'graduate',
    label: 'graduate',
  },
  {
    nameInDefaqtoAPI: 'fee paying account',
    label: 'feePayingAccount',
  },
];

const listAccountTypes = (): string[] => {
  return accountTypes.map((at) => at.label);
};

const listAccountFeatures = (): string[] => {
  return [
    'chequeBookAvailable',
    'noMonthlyFee',
    'openToNewCustomers',
    'overdraftFacilities',
    'sevenDaySwitching',
  ];
};

const listAccountAccess = (): string[] => {
  return [
    'branchBanking',
    'internetBanking',
    'mobileAppBanking',
    'postOfficeBanking',
  ];
};

const accountTypeLabelFromDefaqtoAccountType = (
  nameInDefaqtoAPI: string,
): string => {
  const accountType = accountTypes.filter(
    (a) => a.nameInDefaqtoAPI === nameInDefaqtoAPI,
  )[0];

  if (accountType) {
    return accountType.label;
  } else {
    throw new Error(
      "No label for Defaqto account type '" + nameInDefaqtoAPI + "'",
    );
  }
};

export {
  accountTypeLabelFromDefaqtoAccountType,
  listAccountAccess,
  listAccountFeatures,
  listAccountTypes,
};
