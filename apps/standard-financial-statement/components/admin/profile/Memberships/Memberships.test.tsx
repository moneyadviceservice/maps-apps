import { render, screen } from '@testing-library/react';

import { Organisation } from '../../../../types/Organisations';
import { baseMockData as mockData } from '../__tests__mocks/mock-data';
import { Memberships } from './Memberships';

import '@testing-library/jest-dom';

jest.mock('../../../formInputs/RadioSelect', () => ({
  RadioSelect: (props: { defaultValue?: string }) => (
    <div data-testid="radio-select">{props.defaultValue}</div>
  ),
}));

const baseMockData: Organisation = {
  ...mockData,
  licence_status: '',
  licence_number: '',
};

describe('Memberships', () => {
  describe('Memberships component in read mode', () => {
    it('displays FCA registration status and licence number', () => {
      const mockData: Organisation = {
        ...baseMockData,
        fca: { fca_number: '123456' },
      };

      const { getByTestId } = render(<Memberships data={mockData} />);

      expect(getByTestId('fca-registered')).toHaveTextContent('Yes');
      expect(getByTestId('fca-number')).toHaveTextContent('123456');
    });

    it('shows "No" and "N/A" if no FCA number is present', () => {
      const { getByTestId } = render(<Memberships data={baseMockData} />);

      expect(getByTestId('fca-registered')).toHaveTextContent('No');
      expect(getByTestId('fca-number')).toHaveTextContent('N/A');
    });

    it('renders organisation memberships', () => {
      const mockData: Organisation = {
        ...baseMockData,
        organisation_membership: [
          { title: 'FS Register', key: 'FSR123' },
          { title: 'UK Regulators', key: 'UKR456' },
        ],
      };

      const { getByText } = render(<Memberships data={mockData} />);

      const membershipItems = screen.getAllByTestId('membership-item');
      expect(membershipItems).toHaveLength(2);
      expect(getByText('FS Register')).toBeInTheDocument();
      expect(getByText('UKR456')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
      const mockData: Organisation = {
        ...baseMockData,
        fca: { fca_number: '999999' },
        organisation_membership: [{ title: 'Example Org', key: 'EX123' }],
      };

      const { container } = render(<Memberships data={mockData} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Memberships component in edit mode', () => {
    it('render with correct defaultValues', () => {
      const mockData: Organisation = {
        ...baseMockData,
        fca: { fca_number: 'FCA-123456' },
        organisation_membership: [
          { title: 'AdviceUK', key: 'auk' },
          { title: 'IMA', key: 'ima' },
        ],
      };

      const { container, getByTestId, getAllByTestId, getByDisplayValue } =
        render(<Memberships data={mockData} isEditMode={true} />);

      const radioSelect = getByTestId('radio-select');
      expect(radioSelect).toHaveTextContent('yes');

      const fcaInput = getByDisplayValue('FCA-123456');
      expect(fcaInput).toBeInTheDocument();
      expect(fcaInput).toHaveAttribute('name', 'fca_number');

      const membershipItems = getAllByTestId('membership-item');
      expect(membershipItems).toHaveLength(2);

      expect(getByDisplayValue('AdviceUK')).toBeInTheDocument();
      expect(getByDisplayValue('auk')).toBeInTheDocument();

      expect(getByDisplayValue('IMA')).toBeInTheDocument();
      expect(getByDisplayValue('ima')).toHaveAttribute(
        'name',
        'organisation_membership[1].key',
      );

      expect(container).toMatchSnapshot();
    });
  });
});
