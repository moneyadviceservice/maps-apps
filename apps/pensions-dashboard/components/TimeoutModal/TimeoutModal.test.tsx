import { useRouter } from 'next/router';

import { fireEvent, render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { TimeoutModal, TimeoutModalProps } from './TimeoutModal';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

let mockPush: jest.Mock;

describe('TimeoutModal', () => {
  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    jest.useFakeTimers();
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const defaultProps: TimeoutModalProps = {
    isOpen: true,
    onCloseClick: jest.fn(),
    modalTimeout: 60000,
  };

  it('should render the modal when isOpen is true', () => {
    render(<TimeoutModal {...defaultProps} />);
    expect(screen.getByTestId('timeout-dialog')).toBeInTheDocument();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<TimeoutModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onCloseClick when close button is clicked', () => {
    render(<TimeoutModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('close-dialog'));
    expect(defaultProps.onCloseClick).toHaveBeenCalled();
  });

  it('should display the remaining time correctly', () => {
    render(<TimeoutModal {...defaultProps} />);
    expect(screen.getByText('1 timeout.minute')).toBeInTheDocument();
    expect(screen.getByTestId('live-region')).toHaveTextContent(
      'timeout.modal-session-timeout 1 timeout.minute',
    );
  });

  it('should stop the timer when modal is closed', () => {
    const { rerender } = render(<TimeoutModal {...defaultProps} />);
    rerender(<TimeoutModal {...defaultProps} isOpen={false} />);
    jest.advanceTimersByTime(60000);
    expect(defaultProps.onCloseClick).not.toHaveBeenCalled();
  });

  it('should redirect to the session expired page when the timer reaches 0', () => {
    const router = useRouter();
    render(<TimeoutModal {...defaultProps} />);
    jest.advanceTimersByTime(60000);
    expect(router.push).toHaveBeenCalledWith('/en/your-session-has-expired');
  });
});
