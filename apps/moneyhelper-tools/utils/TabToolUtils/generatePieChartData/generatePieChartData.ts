import { PieData } from 'components/SummarySpendBreakdown';
import { GroupedFieldItem } from 'data/types';

const colourArray = ['#00788F', '#E67032', '#AE0060', '#7F992F', '#000B3A'];

export const generatePieChartData = (groupedFieldItems: GroupedFieldItem[]) => {
  const expenseTotal = groupedFieldItems.reduce((sum, { value }) => {
    return sum + Number(value);
  }, 0);

  return groupedFieldItems.reduce<PieData[]>(
    (acc, { name, value, url }, i): PieData[] => {
      let colorIndex;
      if (i < colourArray.length) {
        colorIndex = i;
      } else {
        colorIndex = ((i - 1) % (colourArray.length - 1)) + 1;
      }

      return [
        ...acc,
        {
          name: name,
          value: value,
          url: url,
          percentage: (value / expenseTotal) * 100 || 0,
          colour: colourArray[colorIndex],
        },
      ];
    },
    [],
  );
};
