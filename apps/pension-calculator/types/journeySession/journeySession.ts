import type { AboutYouData } from 'types/aboutYou';
import type { YourIncomeData } from 'types/income';
import type { PotsOfMoneyData } from 'types/pensions';

/** App-shaped journey session stored under one Redis key. Map to EV at results. */
export type JourneySessionData = {
  aboutYou?: AboutYouData;
  income?: YourIncomeData;
  potsOfMoney?: PotsOfMoneyData;
};
