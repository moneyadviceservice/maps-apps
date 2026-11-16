import { render } from '@testing-library/react';
import { ResultsBox } from './ResultsBox';

import '@testing-library/jest-dom/extend-expect';

import { ContractualRedundancyProvided } from '../../../utils/parseStoredData';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((obj) => obj.en),
  }),
}));

describe('Redundancy pay calculator', () => {
  describe('ResultsBox Component', () => {
    it.each`
      dateOfBirth   | salary                             | jobStart    | jobEnd      | country | contractualRedundancy                                                                             | yearsWorked | statutoryRedundancyPay
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Unknown, amount: 0 }}                                 | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: 10000 }}                                 | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: 1000 }}                                  | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: ContractualRedundancyProvided.Unknown }} | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2024'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: ContractualRedundancyProvided.Unknown }} | ${1}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
    `(
      'renders the component with provided props',
      ({
        dateOfBirth,
        salary,
        jobStart,
        jobEnd,
        country,
        contractualRedundancy,
        yearsWorked,
        statutoryRedundancyPay,
      }) => {
        const parsedData = {
          dateOfBirth,
          salary,
          jobStart,
          jobEnd,
          country,
          contractualRedundancy: contractualRedundancy,
        };

        const { container } = render(
          <ResultsBox
            parsedData={parsedData}
            statutoryRedundancyPay={statutoryRedundancyPay}
            yearsWorked={yearsWorked}
          />,
        );

        expect(container.firstChild).toMatchSnapshot();
      },
    );
  });

  it('renders correctly for Northern Ireland before cutoff date', () => {
    const parsedData = {
      dateOfBirth: '4-5-1980',
      salary: { amount: 15000, frequency: 0 },
      jobStart: '3-2020',
      jobEnd: '02-2025',
      country: 3, // Northern Ireland
      contractualRedundancy: {
        provided: ContractualRedundancyProvided.Yes,
        amount: 10000,
      },
    };

    const statutoryRedundancyPay = { amount: 1587, entitlementWeeks: 5.5 };
    const yearsWorked = 5;

    const { container } = render(
      <ResultsBox
        parsedData={parsedData}
        statutoryRedundancyPay={statutoryRedundancyPay}
        yearsWorked={yearsWorked}
      />,
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('returns early when contractualRedundancy is undefined', () => {
    const parsedData = {
      dateOfBirth: '4-5-1980',
      salary: { amount: 15000, frequency: 0 },
      jobStart: '3-2020',
      jobEnd: '02-2025',
      country: 0,
      contractualRedundancy: undefined,
    };

    const statutoryRedundancyPay = { amount: 1587, entitlementWeeks: 5.5 };

    const { container } = render(
      <ResultsBox
        parsedData={parsedData as any}
        statutoryRedundancyPay={statutoryRedundancyPay}
        yearsWorked={5}
      />,
    );

    expect(container.firstChild).toBeNull();
  });
});
