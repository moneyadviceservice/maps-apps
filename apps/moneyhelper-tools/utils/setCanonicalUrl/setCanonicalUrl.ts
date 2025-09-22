export const setCanonicalUrl = (path: string) => {
  const canonicalUrls: { [key: string]: string } = {
    '/en/ltt-calculator':
      'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-transaction-tax-calculator-wales',
    '/cy/ltt-calculator':
      'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-transaction-tax-calculator-wales',
    '/en/lbtt-calculator':
      'https://www.moneyhelper.org.uk/en/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
    '/cy/lbtt-calculator':
      'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/land-and-buildings-transaction-tax-calculator-scotland',
    '/en/sdlt-calculator':
      'https://www.moneyhelper.org.uk/en/homes/buying-a-home/stamp-duty-calculator',
    '/cy/sdlt-calculator':
      'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/stamp-duty-calculator',
    '/en/mid-life-mot':
      'https://www.moneyhelper.org.uk/en/everyday-money/midlife-mot',
    '/cy/mid-life-mot':
      'https://www.moneyhelper.org.uk/cy/everyday-money/midlife-mot',
    '/en/mortgage-calculator':
      'https://www.moneyhelper.org.uk/en/homes/buying-a-home/mortgage-calculator',
    '/cy/mortgage-calculator':
      'https://www.moneyhelper.org.uk/cy/homes/buying-a-home/mortgage-calculator',
    '/en/use-our-compare-bank-account-fees-and-charges-tool':
      'https://www.moneyhelper.org.uk/en/everyday-money/banking/compare-bank-account-fees-and-charges',
    '/cy/use-our-compare-bank-account-fees-and-charges-tool':
      'https://www.moneyhelper.org.uk/cy/everyday-money/banking/compare-bank-account-fees-and-charges',
    '/en/baby-cost-calculator':
      'https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/baby-costs-calculator',
    '/cy/baby-cost-calculator':
      'https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/baby-costs-calculator',
    '/en/dalt-calculator': '',
    '/cy/dalt-calculator': '',
    '/en/inbest': '',
    '/cy/inbest': '',
    '/en/universal-credit': '',
    '/cy/universal-credit': '',
    '/en/credit-options': '',
    '/cy/credit-options': '',
    '/en/savings-calculator':
      'https://www.moneyhelper.org.uk/en/savings/how-to-save/savings-calculator',
    '/cy/savings-calculator':
      'https://www.moneyhelper.org.uk/cy/savings/how-to-save/savings-calculator',
    '/en/baby-money-timeline':
      'https://www.moneyhelper.org.uk/en/family-and-care/becoming-a-parent/baby-money-timeline',
    '/cy/baby-money-timeline':
      'https://www.moneyhelper.org.uk/cy/family-and-care/becoming-a-parent/baby-money-timeline',
  };

  const canonicalUrlKey = Object.keys(canonicalUrls).filter((url) =>
    path.startsWith(url),
  )[0];
  return canonicalUrls[canonicalUrlKey] || '';
};
