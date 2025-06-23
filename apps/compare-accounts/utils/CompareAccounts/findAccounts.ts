import { getDayOfYear, getHours, getYear } from 'date-fns';
import { dinero, DineroOptions, greaterThan } from 'dinero.js';

interface Account {
  name: string;
  providerName: string;
  type: string;
  features: string[];
  access: string[];
  monthlyFee: number;
  minimumMonthlyCredit: number;
  representativeAPR: number;
  overdraftFacility: boolean;
  unauthODMonthlyCap: { amount: number } | null;
}

interface SearchOptions {
  searchQuery: string;
  order: string;
  accountTypes: string[];
  accountFeatures: string[];
  accountAccess: string[];
}

const findAccounts = (
  accounts: Account[],
  {
    searchQuery,
    order,
    accountTypes,
    accountFeatures,
    accountAccess,
  }: SearchOptions,
) => {
  const searchMatches = (matches: Account[]) => {
    if (searchQuery) {
      const needle = searchQuery.toLowerCase();
      matches = matches.filter((a) => {
        const haystack = [a.name, a.providerName].join(' ').toLowerCase();
        return haystack.indexOf(needle) > -1;
      });
    }

    return matches;
  };

  const orderMatches = (matches: Account[]): Account[] => {
    if (order === 'random') {
      return shuffle(matches);
    } else if (order === 'providerNameAZ') {
      return orderByStringField('providerName', matches);
    } else if (order === 'providerNameZA') {
      return orderByStringFieldInReverse('providerName', matches);
    } else if (order === 'accountNameAZ') {
      return orderByStringField('name', matches);
    } else if (order === 'accountNameZA') {
      return orderByStringFieldInReverse('name', matches);
    } else if (order === 'monthlyAccountFeeLowestFirst') {
      return orderByMoneyField('monthlyFee', matches);
    } else if (order === 'minimumMonthlyDepositLowestFirst') {
      return orderByMoneyField('minimumMonthlyCredit', matches);
    } else if (order === 'arrangedOverdraftRateLowestFirst') {
      return orderArrangedOverdraft(matches);
    } else if (order === 'unarrangedMaximumMonthlyChargeLowestFirst') {
      return orderUnarrangedOverdraft(matches);
    } else {
      return [];
    }
  };

  const filterMatches = (matches: Account[]) => {
    if (
      accountTypes.length === 0 &&
      accountFeatures.length === 0 &&
      accountAccess.length === 0
    ) {
      return matches;
    }

    return matches.filter((a) => {
      return (
        (accountTypes.length === 0 || accountTypes.includes(a.type)) &&
        (accountFeatures.length === 0 ||
          accountFeatures.every((r) => a.features.includes(r))) &&
        (accountAccess.length === 0 ||
          accountAccess.every((r) => a.access.includes(r)))
      );
    });
  };

  const orderByStringField = (field: keyof Account, array: Account[]) => {
    return array
      .slice()
      .sort((a, b) =>
        String(a[field])?.toLowerCase() > String(b[field])?.toLowerCase()
          ? 1
          : -1,
      );
  };

  const orderByStringFieldInReverse = (
    field: keyof Account,
    array: Account[],
  ) => {
    return array
      .slice()
      .sort((a, b) =>
        String(a[field])?.toLowerCase() < String(b[field])?.toLowerCase()
          ? 1
          : -1,
      );
  };

  const orderArrangedOverdraft = (array: Account[]) => {
    const notAvailableAccounts = array.filter(
      (item) =>
        item['representativeAPR'] < 0 || item['representativeAPR'] === 0,
    );
    const availableAccount = array.filter(
      (item) => item['representativeAPR'] > 0,
    );
    return orderByPercentageField('representativeAPR', availableAccount).concat(
      notAvailableAccounts,
    );
  };

  const orderUnarrangedOverdraft = (accounts: Account[]) => {
    const notOfferedMonthlyCap = accounts.filter(
      (match) => match.unauthODMonthlyCap?.amount === 0,
    );
    const otherMonthlyCap = accounts.filter(
      (match) =>
        match['unauthODMonthlyCap'] !== null &&
        match.unauthODMonthlyCap?.amount > 0,
    );
    const infinityMonthlyCap = accounts.filter(
      (match) => match['unauthODMonthlyCap'] === null,
    );
    return [
      ...notOfferedMonthlyCap,
      ...orderByMoneyField('unauthODMonthlyCap', otherMonthlyCap),
      ...infinityMonthlyCap,
    ];
  };

  const orderByPercentageField = (field: keyof Account, array: Account[]) => {
    return array.slice().sort((a, b) => {
      const typeA:
        | string
        | number
        | boolean
        | string[]
        | { amount: number }
        | null = a[field];
      const typeB:
        | string
        | number
        | boolean
        | string[]
        | { amount: number }
        | null = b[field];

      if (typeA === null && typeB === null) {
        return 0;
      }
      if (typeA === null) {
        return -1;
      }
      if (typeB === null) {
        return 1;
      }

      return typeA > typeB ? 1 : -1;
    });
  };

  const orderByMoneyField = (field: keyof Account, array: Account[]) => {
    return array.slice().sort((a, b) => {
      if (!a[field]) {
        return -1;
      } else if (!b[field]) {
        return 1;
      }

      const dineroA = dinero(a[field] as DineroOptions<number>);
      const dineroB = dinero(b[field] as DineroOptions<number>);

      if (greaterThan(dineroB, dineroA)) {
        return -1;
      } else if (greaterThan(dineroA, dineroB)) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const shuffle = (array: Account[]) => {
    let seed = generateSeed();
    let m = array.length;
    let t;
    let i;

    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(random(seed) * m--); // <-- MODIFIED LINE

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
      ++seed; // <-- ADDED LINE
    }

    return array;
  };

  const random = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const generateSeed = () => {
    // This allows us to generate a stable search sort, which will only change every other hour.
    // We add this number to the day of the year so that we get 365 more possible seeds.
    const now = new Date();
    return getYear(now) + getDayOfYear(now) + getHours(now);
  };

  let matches = accounts;

  matches = searchMatches(matches);
  matches = filterMatches(matches);
  matches = orderMatches(matches);

  return matches;
};

export default findAccounts;
