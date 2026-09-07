import useTranslation from '@maps-react/hooks/useTranslation';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Dialog, DialogProps } from './Dialog';

jest.mock('@maps-react/hooks/useTranslation');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('TimeoutModal', () => {
  const defaultProps: DialogProps = {
    isOpen: true,
    accessibilityLabelClose: 'Close',
    accessibilityLabelReset: 'Reset',
    onCloseClick: jest.fn(),
    children: <div>Content</div>,
  };

  // Mock the translation hook and dialog methods in a shared beforeEach
  const setupMocks = () => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  };

  beforeEach(() => {
    setupMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the modal when isOpen is true', () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
  });

  it('should not render the modal when isOpen is false', () => {
    render(<Dialog {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should call onCloseClick when close button is clicked', () => {
    render(<Dialog {...defaultProps} />);
    fireEvent.click(screen.getByTestId('close-dialog'));
    expect(defaultProps.onCloseClick).toHaveBeenCalled();
  });
});
