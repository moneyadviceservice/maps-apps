import { fireEvent, render, screen } from '@testing-library/react';

import { modalContent } from '../../../../../data/modal-content/status-change';
import { Action, ModalContent } from '../../../../../types/admin/base';
import { ActionModalContent } from './ActionModalContent';

import '@testing-library/jest-dom';

describe('ActionModalContent', () => {
  const defaultProps = {
    action: 'approve' as Action,
    orgName: 'Test Org',
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    error: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing if action is not found in modalContent', () => {
    const { container } = render(
      <ActionModalContent
        {...defaultProps}
        action={'non-existent' as Action}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders title and content from modalContent', () => {
    render(<ActionModalContent {...defaultProps} />);

    expect(screen.getByTestId('modal-heading')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.queryByTestId('email-body-label')).not.toBeInTheDocument();
    expect(screen.queryByTestId('additional-copy')).not.toBeInTheDocument();
  });

  it('renders email copy input if additionalLabel is present', () => {
    const data = modalContent[defaultProps.action] as ModalContent;
    if (data.emailData?.additionalLabel) {
      render(<ActionModalContent {...defaultProps} />);
      expect(screen.getByTestId('email-body-label')).toHaveTextContent(
        'Email body text',
      );
      expect(screen.getByTestId('additional-copy')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Congratulations, your organisation has been approved to use the SFS.',
        ),
      ).toBeInTheDocument();

      const input = screen.getByTestId('additional-copy');
      fireEvent.change(input, { target: { value: 'My extra reason' } });

      expect(input).toHaveValue('My extra reason');
    }
  });

  it('calls onConfirm with correct parameters on primary button click', () => {
    const data = modalContent[defaultProps.action] as ModalContent;
    render(<ActionModalContent {...defaultProps} />);
    const input = screen.queryByTestId('additional-copy');

    if (input) {
      fireEvent.change(input, { target: { value: 'Extra reason' } });
    }

    fireEvent.click(screen.getByTestId('modal-primary-button'));
    expect(defaultProps.onConfirm).toHaveBeenCalledWith(
      data.emailData,
      input ? 'Extra reason' : '',
    );
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<ActionModalContent {...defaultProps} />);
    fireEvent.click(screen.getByTestId('modal-secondary-button'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('displays error message if error is passed', () => {
    render(
      <ActionModalContent {...defaultProps} error="Something went wrong" />,
    );
    expect(screen.getByTestId('modal-error')).toBeInTheDocument();
  });
});
