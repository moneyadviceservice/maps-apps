import { fireEvent, render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { Dialog, DialogProps } from './Dialog';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('TimeoutModal', () => {
  beforeEach(() => {
    (useTranslation as jest.Mock).mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const defaultProps: DialogProps = {
    isOpen: true,
    accessibilityLabelClose: 'Close',
    accessibilityLabelReset: 'Reset',
    onCloseClick: jest.fn(),
    children: <div>Content</div>,
  };

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
