import { render } from '@testing-library/react';
import { AdditionalInfo } from './AdditionalInfo';

import '@testing-library/jest-dom/extend-expect';

import { ContractualRedundancyProvided } from '../../../utils/parseStoredData';
import copy from 'data/form-content/text/results';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: jest.fn((obj) => obj.en),
  }),
}));

describe('Redundancy pay calculator', () => {
  describe('AdditionalInfo Component', () => {
    it.each`
      dateOfBirth   | salary                             | jobStart    | jobEnd      | country | contractualRedundancy                                                                             | yearsWorked | statutoryRedundancyPay
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Unknown, amount: 0 }}                                 | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: 2000 }}                                  | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: 1000 }}                                  | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: ContractualRedundancyProvided.Unknown }} | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'4-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.No, amount: 0 }}                                      | ${5}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2024'} | ${'2-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: ContractualRedundancyProvided.Unknown }} | ${1}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2024'} | ${'4-2025'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: 2000 }}                                  | ${2}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
      ${'4-5-1980'} | ${{ amount: 15000, frequency: 0 }} | ${'3-2020'} | ${'3-2023'} | ${0}    | ${{ provided: ContractualRedundancyProvided.Yes, amount: 1500 }}                                  | ${2}        | ${{ amount: 1587, entitlementWeeks: 5.5 }}
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
          <AdditionalInfo
            parsedData={parsedData}
            statutoryRedundancyPay={statutoryRedundancyPay}
            yearsWorked={yearsWorked}
          />,
        );

        expect(container.firstChild).toMatchSnapshot();
      },
    );

    it('renders correctly for yearsWorked < 2 and unknown contractual redundancy', () => {
      const parsedData = {
        dateOfBirth: '4-5-1980',
        salary: { amount: 15000, frequency: 0 },
        jobStart: '3-2024',
        jobEnd: '4-2025',
        country: 0,
        contractualRedundancy: {
          provided: ContractualRedundancyProvided.Unknown,
          amount: 0,
        },
      };
      const statutoryRedundancyPay = { amount: 1587, entitlementWeeks: 5.5 };
      const yearsWorked = 1;

      const { container } = render(
        <AdditionalInfo
          parsedData={parsedData}
          statutoryRedundancyPay={statutoryRedundancyPay}
          yearsWorked={yearsWorked}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders correctly when statutory redundancy pay is higher than contractual redundancy', () => {
      const parsedData = {
        dateOfBirth: '4-5-1980',
        salary: { amount: 15000, frequency: 0 },
        jobStart: '3-2020',
        jobEnd: '2-2025',
        country: 0,
        contractualRedundancy: {
          provided: ContractualRedundancyProvided.Yes,
          amount: 1000,
        },
      };
      const statutoryRedundancyPay = { amount: 1587, entitlementWeeks: 5.5 };
      const yearsWorked = 5;

      const { container } = render(
        <AdditionalInfo
          parsedData={parsedData}
          statutoryRedundancyPay={statutoryRedundancyPay}
          yearsWorked={yearsWorked}
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('returns early when jobEnd or contractualRedundancy is undefined', () => {
    const baseData = {
      dateOfBirth: '4-5-1980',
      salary: { amount: 15000, frequency: 0 },
      jobStart: '3-2020',
      country: 0,
    };

    const testCases = [
      {
        description: 'jobEnd is undefined',
        parsedData: {
          ...baseData,
          jobEnd: undefined,
          contractualRedundancy: {
            provided: ContractualRedundancyProvided.Unknown,
            amount: 0,
          },
        },
      },
      {
        description: 'contractualRedundancy is undefined',
        parsedData: {
          ...baseData,
          jobEnd: '2-2025',
          contractualRedundancy: undefined,
        },
      },
    ];

    const statutoryRedundancyPay = { amount: 1587, entitlementWeeks: 5.5 };
    const yearsWorked = 5;

    testCases.forEach(({ parsedData }) => {
      const { container } = render(
        <AdditionalInfo
          parsedData={parsedData}
          statutoryRedundancyPay={statutoryRedundancyPay}
          yearsWorked={yearsWorked}
        />,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  it('renders additional info for job ending in next financial year with no contractual pay', () => {
    const parsedData = {
      dateOfBirth: '4-5-1980',
      salary: { amount: 15000, frequency: 0 },
      jobStart: '3-2020',
      jobEnd: '4-2026',
      country: 0,
      contractualRedundancy: {
        provided: ContractualRedundancyProvided.No,
        amount: 0,
      },
    };
    const statutoryRedundancyPay = { amount: 1587, entitlementWeeks: 5.5 };
    const yearsWorked = 5;

    const { getByText } = render(
      <AdditionalInfo
        parsedData={parsedData}
        statutoryRedundancyPay={statutoryRedundancyPay}
        yearsWorked={yearsWorked}
      />,
    );

    expect(
      getByText(copy.additionalInfo.nextFinancialYear.en),
    ).toBeInTheDocument();
  });
});
