import tabs, { API_ENDPOINT } from '../data/budget-planner';
import { TranslationGroup } from '../data/types';
import { Props } from '../pages/[language]/budget-planner';
import { sumFields } from '../utils/sumFields';

type Breakdown = {
  title: TranslationGroup;
  name: string;
  value: number;
  colour: string;
  url: string;
}[];

export default function calculateBreakdown(
  data: Props['data'],
  divisor: number,
  returnEmpty = false,
) {
  return (carry: Breakdown, tab: (typeof tabs)[number]): Breakdown => {
    const total = sumFields(tab, data);

    if (!total && !returnEmpty) return carry;
    // @note Percentage and localisation is calculated from the summary in the component.
    return [
      ...carry,
      {
        title: tab.title,
        name: tab.name,
        value: total ? total / divisor : 0,
        colour: tab.colour ?? '#00788E',
        url: `${API_ENDPOINT}/${tab.name}`,
      },
    ];
  };
}
