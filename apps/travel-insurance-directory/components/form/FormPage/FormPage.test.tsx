import { fireEvent, render, screen } from '@testing-library/react';

import { FormPage } from './FormPage';

import '@testing-library/jest-dom';

describe('FormPage Component', () => {
  const mockSubmitAction = jest.fn();

  const defaultProps = {
    submitAction: mockSubmitAction,
    nonJsSubmitFallback: '/fallback-url',
    formName: 'test-form',
    children: <div data-testid="child-element">Child Content</div>,
  };

  beforeEach(() => {
    mockSubmitAction.mockClear();
  });

  it('renders the form with children and the primary submit button', () => {
    render(<FormPage {...defaultProps} />);

    const formElement = screen.getByTestId('test-form');
    expect(formElement).toBeInTheDocument();
    expect(formElement).toHaveAttribute('action', '/fallback-url');
    expect(formElement).toHaveAttribute('id', 'test-form');

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Continue');
    expect(submitButton).not.toBeDisabled();
  });

  it('calls submitAction when the form is submitted', () => {
    render(<FormPage {...defaultProps} />);

    const formElement = screen.getByTestId('test-form');

    fireEvent.submit(formElement);

    expect(mockSubmitAction).toHaveBeenCalledTimes(1);
  });

  it('disables the primary submit button when isPending is true', () => {
    render(<FormPage {...defaultProps} isPending={true} />);

    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeDisabled();
  });

  it('does not render the Save button by default', () => {
    render(<FormPage {...defaultProps} />);

    const saveButton = screen.queryByTestId('save-button');
    expect(saveButton).not.toBeInTheDocument();
  });

  it('renders the Save button when showSaveButton is true', () => {
    render(<FormPage {...defaultProps} showSaveButton={true} />);

    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent('Save and come back later');
    expect(saveButton).toHaveAttribute('name', 'action');
    expect(saveButton).toHaveAttribute('value', 'save');
    expect(saveButton).toHaveAttribute('form', 'test-form');
  });

  it('applies standard custom classes correctly', () => {
    render(<FormPage {...defaultProps} className="custom-test-class" />);

    const formElement = screen.getByTestId('test-form');
    expect(formElement).toHaveClass('custom-test-class');
  });
});
