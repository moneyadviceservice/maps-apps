import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Action } from '../../../../types/admin/base';
import { Organisation } from '../../../../types/Organisations';
import { ManageLicence } from './ManageLicence';

import '@testing-library/jest-dom';

type ActionButtonsProps = {
  updateStatus: (action: Action) => void;
};

jest.mock('./ActionButtons', () => ({
  ActionButtons: ({ updateStatus }: ActionButtonsProps) => (
    <div>
      <button onClick={() => updateStatus('approve')} data-testid="approve">
        Approve
      </button>
      <button onClick={() => updateStatus('decline')} data-testid="decline">
        Decline
      </button>
      <button
        onClick={() => updateStatus('requestMoreInfo')}
        data-testid="requestMoreInfo"
      >
        More Info
      </button>
    </div>
  ),
}));

const mockOrg: Organisation = {
  name: 'Test Org',
  email: 'test@example.com',
  licence_number: 'ABC123',
  licence_status: 'Pending',
} as Organisation;

const renderComponent = () => render(<ManageLicence data={mockOrg} />);

describe('ManageLicence', () => {
  it('renders initial status and membership code correctly', () => {
    renderComponent();

    expect(screen.getByTestId('status-badge')).toHaveTextContent('Pending');
  });

  it.each([
    ['approve', 'Approved', 'bg-green-200', 'ABC123'],
    ['decline', 'Declined', 'bg-red-400', ''],
    ['requestMoreInfo', 'Requesting info', 'bg-magenta-700', ''],
  ])(
    'updates UI when "%s" action is triggered',
    async (action, expectedStatus, expectedClass, expectedCode) => {
      renderComponent();
      await userEvent.click(screen.getByTestId(action));

      const badge = screen.getByTestId('status-badge');
      const code = screen.getByTestId('membership-code');

      expect(badge).toHaveTextContent(expectedStatus);
      expect(badge.className).toContain(expectedClass);
      expect(code).toHaveTextContent(expectedCode);
    },
  );
});
