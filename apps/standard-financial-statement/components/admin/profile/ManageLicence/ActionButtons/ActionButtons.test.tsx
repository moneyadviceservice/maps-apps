import { ReactNode } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { Action, EmailData } from '../../../../../types/admin/base';
import { Organisation } from '../../../../../types/Organisations';
import { ActionButtons } from './ActionButtons';

import '@testing-library/jest-dom';

type ModalProps = {
  readonly isOpen: boolean;
  readonly children: ReactNode;
};

type ActionModalContentProps = {
  action: Action;
  orgName: string;
  onCancel: () => void;
  onConfirm: (emailData?: EmailData, additionalEmailCopy?: string) => void;
  error?: string;
};

jest.mock('../ActionModalContent', () => ({
  ActionModalContent: ({
    onCancel,
    onConfirm,
    action,
    orgName,
    error,
  }: ActionModalContentProps) => {
    const mockEmailData = {
      notifyWithEmail: true,
      emailContent:
        'Congratulations, your organisation has been approved to use the SFS.',
      additionalLabel: 'Note:',
    };

    return (
      <div data-testid="action-modal-content">
        <p>Action: {action}</p>
        <p>Org: {orgName}</p>
        {error && <p>{error}</p>}
        <button
          onClick={() => onConfirm(mockEmailData, 'some extra content')}
          data-testid="modal-primary-button"
        >
          Confirm
        </button>
        <button onClick={onCancel} data-testid="modal-secondary-button">
          Cancel
        </button>
      </div>
    );
  },
}));

jest.mock('../../../../Modal', () => ({
  Modal: ({ children, isOpen }: ModalProps) =>
    isOpen ? <div data-testid="modal-container">{children}</div> : null,
}));

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

const mockUpdateStatus = jest.fn();
const mockOrganisation: Organisation = {
  name: 'Test Org',
  email: 'test@example.com',
  licence_number: 'ABC123',
} as Organisation;

const renderComponent = (mockOrganisation: Organisation) =>
  render(
    <ActionButtons data={mockOrganisation} updateStatus={mockUpdateStatus} />,
  );

const openModalWithButton = (
  mockOrganisation: Organisation,
  buttonTestId: string,
) => {
  renderComponent(mockOrganisation);
  fireEvent.click(screen.getByTestId(buttonTestId));
};

describe('ActionButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all action buttons', () => {
    renderComponent(mockOrganisation);
    expect(screen.getByTestId('approve-button')).toBeInTheDocument();
    expect(screen.getByTestId('decline-button')).toBeInTheDocument();
    expect(screen.getByTestId('more-info-button')).toBeInTheDocument();
  });

  it.each([
    ['approve-button', 'approve'],
    ['decline-button', 'decline'],
    ['more-info-button', 'requestMoreInfo'],
  ])('opens modal when %s is clicked', (buttonTestId, expectedAction) => {
    openModalWithButton(mockOrganisation, buttonTestId);
    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    expect(screen.getByTestId('action-modal-content')).toHaveTextContent(
      `Action: ${expectedAction}`,
    );
  });

  it('closes modal on cancel', () => {
    openModalWithButton(mockOrganisation, 'approve-button');
    fireEvent.click(screen.getByTestId('modal-secondary-button'));
    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  it('calls update and notify APIs when notifyWithEmail is true and email exists', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    openModalWithButton(mockOrganisation, 'approve-button');
    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);

      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        '/api/update-licence-status',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({
            licence_number: 'ABC123',
            action: 'approve',
          }),
        }),
      );

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        '/api/notify-org-status-change',
        expect.objectContaining({
          method: 'post',
          body: expect.stringContaining('"email":"test@example.com"'),
        }),
      );
    });

    expect(mockUpdateStatus).toHaveBeenCalledWith('approve');
    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  it('sets error if organisation has no email and notifyWithEmail is true', async () => {
    mockFetch.mockResolvedValue({ ok: true });

    const mockDataWithoutEmail = { ...mockOrganisation, email: undefined };

    openModalWithButton(mockDataWithoutEmail, 'approve-button');

    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(
        screen.getByText('No primary email attached to the company'),
      ).toBeInTheDocument();
    });
  });

  it('sets error on failed fetch', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Failure'));

    openModalWithButton(mockOrganisation, 'approve-button');
    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(screen.getByText('API Failure')).toBeInTheDocument();
    });
  });
});
