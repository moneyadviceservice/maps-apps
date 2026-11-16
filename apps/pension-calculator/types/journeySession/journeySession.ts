import type { AboutYouData } from 'types/aboutYou';
import type { YourIncomeData } from 'types/income';
import type { DefinedIncomeData, PotsOfMoneyData } from 'types/pensions';
import type { StatePensionData } from 'types/statePension';

/** App-shaped journey session stored under one Redis key. Map to EV at results. */
export type JourneySessionData = {
  aboutYou?: AboutYouData;
  income?: YourIncomeData;
  potsOfMoney?: PotsOfMoneyData;
  incomePensions?: DefinedIncomeData;
  statePension?: StatePensionData;
};
