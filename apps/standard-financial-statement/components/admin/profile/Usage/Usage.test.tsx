import { render, screen } from '@testing-library/react';

import { Organisation } from '../../../../types/Organisations';
import { baseMockData } from '../__tests__mocks/mock-data';
import { Usage } from './Usage';

import '@testing-library/jest-dom';

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: () => <span data-testid="mock-icon" />,
  IconType: {
    TICK_GREEN: 'tick-green',
  },
}));

jest.mock('../../../formInputs/CheckboxGroup', () => ({
  CheckboxGroup: () => <div data-testid="checkbox-group" />,
}));

jest.mock('../../../formInputs/IntendedUseSelect', () => ({
  IntendedUseSelect: () => <div data-testid="intended-use-select" />,
}));

const mockData: Organisation = {
  ...baseMockData,
  id: 'org-123',
  name: 'Test Org',
  type: { type_other: 'debt-advice', title: 'Debt Advice' },
  delivery_channel: [
    { key: '', title: 'Online' },
    { key: '', title: 'Phone' },
  ],
  users: [],
  usage: {
    intended_use: 'To support debt advice processes.',
    launch_date: '01/01/2025',
    management_software_used: 'AdvicePro',
  },
};

describe('Usage', () => {
  describe('Usage in read mode', () => {
    it('renders all usage fields correctly', () => {
      const { getByTestId } = render(<Usage data={mockData} />);
      expect(getByTestId('usage-intended')).toHaveTextContent(
        'To support debt advice processes.',
      );
      expect(getByTestId('usage-launch-date')).toHaveTextContent('01/01/2025');
      expect(getByTestId('usage-software')).toHaveTextContent('AdvicePro');
      expect(getByTestId('usage-delivery-channel')).toHaveTextContent('Online');
      expect(getByTestId('usage-delivery-channel')).toHaveTextContent('Phone');
    });

    it('renders fallback "N/A" when data is missing', () => {
      const emptyData: Organisation = {
        ...mockData,
        usage: undefined,
        delivery_channel: [],
      };

      const { getByTestId } = render(<Usage data={emptyData} />);
      expect(getByTestId('usage-intended')).toHaveTextContent('N/A');
      expect(getByTestId('usage-launch-date')).toHaveTextContent('N/A');
      expect(getByTestId('usage-software')).toHaveTextContent('N/A');
      expect(getByTestId('usage-delivery-channel')).toHaveTextContent('N/A');
    });

    it('matches snapshot', () => {
      const { container } = render(<Usage data={mockData} />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Usage component in edit mode', () => {
    beforeEach(() => {
      render(<Usage data={mockData} isEditMode={true} />);
    });

    it('renders IntendedUseSelect and CheckboxGroup in edit mode', () => {
      expect(screen.getByTestId('intended-use-select')).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-group')).toBeInTheDocument();
    });

    it('renders launch date input with default value', () => {
      const input = screen.getByDisplayValue(
        '01/01/2025',
      ) as unknown as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.name).toBe('launch_date');
    });

    it('renders management software input with default value', () => {
      const input = screen.getByDisplayValue(
        'AdvicePro',
      ) as unknown as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.name).toBe('management_software_used');
    });

    test('renders guidance text for launch date input', () => {
      expect(
        screen.getByText('Add date in 01/01/2025 format'),
      ).toBeInTheDocument();
    });
  });
});
