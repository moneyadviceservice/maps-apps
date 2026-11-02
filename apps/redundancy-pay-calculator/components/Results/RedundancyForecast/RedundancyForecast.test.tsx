import { render } from '@testing-library/react';
import { RedundancyForecast } from './RedundancyForecast';

import '@testing-library/jest-dom/extend-expect';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((obj) => obj.en),
  }),
}));

describe('Redundancy pay calculator', () => {
  describe('ResultsBox Component', () => {
    it.each`
      redundancyPay | salary                              | country | expected
      ${1587}       | ${{ amount: 15000, frequency: 0 }}  | ${0}    | ${'1.3'}
      ${5651}       | ${{ amount: 32650, frequency: 0 }}  | ${3}    | ${'2.4'}
      ${5250}       | ${{ amount: 798, frequency: 2 }}    | ${2}    | ${'1.8'}
      ${2742}       | ${{ amount: 2640, frequency: 1 }}   | ${1}    | ${'1.2'}
      ${1327}       | ${{ amount: 23000, frequency: 0 }}  | ${0}    | ${'0.8'}
      ${3150}       | ${{ amount: 91000, frequency: 0 }}  | ${0}    | ${'0.6'}
      ${0}          | ${{ amount: 154000, frequency: 0 }} | ${1}    | ${'0.0'}
      ${14000}      | ${{ amount: 78514, frequency: 0 }}  | ${0}    | ${'2.8'}
      ${3645}       | ${{ amount: 41500, frequency: 0 }}  | ${3}    | ${'1.2'}
      ${18900}      | ${{ amount: 52943, frequency: 0 }}  | ${0}    | ${'5.1'}
      ${0}          | ${{ amount: 154000, frequency: 0 }} | ${0}    | ${'0.0'}
    `(
      'renders the component with provided props',
      ({ redundancyPay, salary, country }) => {
        const { container } = render(
          <RedundancyForecast
            redundancyPay={redundancyPay}
            salary={salary}
            country={country}
          />,
        );

        expect(container.firstChild).toMatchSnapshot();
      },
    );
  });
});
