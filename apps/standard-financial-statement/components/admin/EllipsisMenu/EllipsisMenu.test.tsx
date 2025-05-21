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
  licence_number: 'ABC123',
  uuid: '',
  type: { title: '' },
  licence_status: '',
  sfs_live: 1,
  created: '',
  modified: '',
};

describe('EllipsisMenu component', () => {
  beforeEach(() => {
    mockSetIsEditMode.mockReset();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useEditMode as jest.Mock).mockReturnValue({
      setIsEditMode: mockSetIsEditMode,
    });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
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

  it('calls the delete API and redirects on confirm', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    openDeleteModal();

    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/delete-organisation', {
        method: 'DELETE',
        body: JSON.stringify({ licence_number: 'ABC123' }),
      });
      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('displays error if fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    openDeleteModal();

    fireEvent.click(screen.getByTestId('modal-primary-button'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
