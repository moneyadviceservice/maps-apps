import data from '../__mocks__/budget-planner-test-data.json';
import tabs from '../data/budget-planner';
import { sumFields } from './sumFields';

describe('sumFields', () => {
  it('should return 0 if no fields are present', () => {
    const result = sumFields(tabs[0], { string: {} });
    expect(result).toEqual(0);
  });

  it('should sum the values of the fields', () => {
    const expectedSum = 1131.5476190476193; // (1000*1)+(250*0.08333333333333333)+(100*1)+(10*1.0714285714285714)
    const result = sumFields(tabs[0], data);
    expect(result).toEqual(expectedSum);
  });
});
