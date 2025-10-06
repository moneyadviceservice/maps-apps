import { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useEditMode } from '../../../contexts/EditModeContext';
import { EllipsisMenu } from './EllipsisMenu';

import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../../contexts/EditModeContext', () => ({
  useEditMode: jest.fn(),
}));

jest.mock('../../Modal', () => ({
  Modal: ({ children, isOpen }: { isOpen: boolean; children: ReactNode }) =>
    isOpen ? <div data-testid="modal-dialog">{children}</div> : null,
}));

const mockPush = jest.fn();
const mockSetIsEditMode = jest.fn();

const organisationMock = {
  id: '1',
  name: 'Test Org',
  licence_number: 12345,
  type: { title: '' },
  licence_status: '',
  sfs_live: true,
  created: '',
  modified: '',
  users: [{ email: 'user1@test.com' }, { email: 'user2@test.com' }],
};

describe('EllipsisMenu component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useEditMode as jest.Mock).mockReturnValue({
      setIsEditMode: mockSetIsEditMode,
    });
    global.fetch = jest.fn();
  });

  const openDeleteModal = () => {
    render(<EllipsisMenu data={organisationMock} />);
    fireEvent.click(screen.getByTestId('ellipsis-menu'));
    fireEvent.click(screen.getByTestId('ellipsis-delete-button'));
  };

  it('should render button initially', () => {
    render(<EllipsisMenu data={organisationMock} />);

    const button = screen.getByRole('button', { name: '...' });
    expect(button).toBeInTheDocument();
  });

  it('should show menu when button is clicked', () => {
    render(<EllipsisMenu data={organisationMock} />);

    const button = screen.getByRole('button', { name: '...' });
    fireEvent.click(button);

    const menu = screen.getByRole('button', { name: /edit organisation/i });
    expect(menu).toBeInTheDocument();
  });

  it('should hide menu when clicking outside', () => {
    render(<EllipsisMenu data={organisationMock} />);

    const button = screen.getByRole('button', { name: '...' });
    fireEvent.click(button);

    const menu = screen.getByRole('button', { name: /edit organisation/i });
    expect(menu).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(menu).not.toBeInTheDocument();
  });

  it('should call setIsEditMode when "Edit organisation" is clicked', () => {
    render(<EllipsisMenu data={organisationMock} />);

    const button = screen.getByRole('button', { name: '...' });
    fireEvent.click(button);

    const editButton = screen.getByRole('button', {
      name: /edit organisation/i,
    });
    fireEvent.click(editButton);

    expect(mockSetIsEditMode).toHaveBeenCalledWith(true);
  });

  it('opens the modal on delete click', () => {
    openDeleteModal();
    expect(screen.getByTestId('modal-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('modal-primary-button')).toBeInTheDocument();
  });

  it('calls both delete APIs and redirects on confirm after successful deletion', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    openDeleteModal();

    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/delete-organisation', {
        method: 'DELETE',
        body: JSON.stringify({
          licence_number: organisationMock.licence_number,
        }),
      });

      expect(fetch).toHaveBeenCalledWith('/api/users/delete', {
        method: 'DELETE',
        body: JSON.stringify({ users: organisationMock.users }),
      });

      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('displays error if cosmos delete API fails', async () => {
    (fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Cosmos delete failed'))
      .mockResolvedValueOnce({ ok: true });

    openDeleteModal();

    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/cosmos delete failed/i)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('displays error if users delete API fails', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true })
      .mockRejectedValueOnce(new Error('User delete failed'));

    openDeleteModal();

    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(screen.getByText(/user delete failed/i)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('matches snapshot', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    const { container } = render(<EllipsisMenu data={organisationMock} />);

    fireEvent.click(screen.getByTestId('ellipsis-menu'));
    fireEvent.click(screen.getByTestId('ellipsis-delete-button'));

    expect(container).toMatchSnapshot();
  });
});
