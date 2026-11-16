import { PieData } from '@maps-react/common/components/SummarySpendBreakdown';

import { GroupedFieldItem } from '../../../types/forms';
import { generatePieChartData } from './generatePieChartData';

describe('generatePieChartData', () => {
  it('should generate correct pie chart data', () => {
    const groupedFieldItems: GroupedFieldItem[] = [
      { name: 'Category 1', value: 100, url: 'url1' },
      { name: 'Category 2', value: 200, url: 'url2' },
      { name: 'Category 3', value: 300, url: 'url3' },
    ];

    const expectedPieData: PieData[] = [
      {
        name: 'Category 1',
        value: 100,
        url: 'url1',
        percentage: 16.666666666666664,
        colour: '#00788F',
      },
      {
        name: 'Category 2',
        value: 200,
        url: 'url2',
        percentage: 33.33333333333333,
        colour: '#E67032',
      },
      {
        name: 'Category 3',
        value: 300,
        url: 'url3',
        percentage: 50,
        colour: '#AE0060',
      },
    ];

    const result = generatePieChartData(groupedFieldItems);

    expect(result).toEqual(expectedPieData);
  });

  it('should handle an empty array', () => {
    const groupedFieldItems: GroupedFieldItem[] = [];

    const result = generatePieChartData(groupedFieldItems);

    expect(result).toEqual([]);
  });

  it('should handle zero values correctly', () => {
    const groupedFieldItems: GroupedFieldItem[] = [
      { name: 'Category 1', value: 0, url: 'url1' },
      { name: 'Category 2', value: 0, url: 'url2' },
    ];

    const result = generatePieChartData(groupedFieldItems);

    const expectedPieData: PieData[] = [
      {
        name: 'Category 1',
        value: 0,
        url: 'url1',
        percentage: 0,
        colour: '#00788F',
      },
      {
        name: 'Category 2',
        value: 0,
        url: 'url2',
        percentage: 0,
        colour: '#E67032',
      },
    ];

    expect(result).toEqual(expectedPieData);
  });

  it('should cycle colours correctly if more items than colours', () => {
    const groupedFieldItems: GroupedFieldItem[] = [
      { name: 'Category 1', value: 100, url: 'url1' },
      { name: 'Category 2', value: 200, url: 'url2' },
      { name: 'Category 3', value: 300, url: 'url3' },
      { name: 'Category 4', value: 400, url: 'url4' },
      { name: 'Category 5', value: 500, url: 'url5' },
      { name: 'Category 6', value: 600, url: 'url6' },
    ];

    const result = generatePieChartData(groupedFieldItems);

    const expectedPieData: PieData[] = [
      {
        name: 'Category 1',
        value: 100,
        url: 'url1',
        percentage: 4.761904761904762,
        colour: '#00788F',
      },
      {
        name: 'Category 2',
        value: 200,
        url: 'url2',
        percentage: 9.523809523809524,
        colour: '#E67032',
      },
      {
        name: 'Category 3',
        value: 300,
        url: 'url3',
        percentage: 14.285714285714285,
        colour: '#AE0060',
      },
      {
        name: 'Category 4',
        value: 400,
        url: 'url4',
        percentage: 19.047619047619047,
        colour: '#7F992F',
      },
      {
        name: 'Category 5',
        value: 500,
        url: 'url5',
        percentage: 23.809523809523807,
        colour: '#000B3A',
      },
      {
        name: 'Category 6',
        value: 600,
        url: 'url6',
        percentage: 28.57142857142857,
        colour: '#E67032',
      },
    ];

    expect(result).toEqual(expectedPieData);
  });
});
