import { render, screen } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { FormWrapper } from './FormWrapper';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('FormWrapper', () => {
  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      locale: 'en',
    });
  });
  it('renders children inside the form', () => {
    const { container } = render(
      <FormWrapper>
        <div data-testid="child">Child Content</div>
      </FormWrapper>,
    );
    expect(container).toMatchSnapshot();
  });

  it('sets aria-label with step when step is provided', () => {
    render(<FormWrapper step="contact-details">Test</FormWrapper>);
    const form = screen.getByRole('form', {
      name: /contact form for step: contact-details/i,
    });
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute(
      'aria-label',
      'Contact form for Step: contact-details',
    );
  });

  it('sets aria-label to default when step is not provided', () => {
    render(<FormWrapper>Test</FormWrapper>);
    const form = screen.getByRole('form', { name: /contact form/i });
    expect(form).toHaveAttribute('aria-label', 'Contact form');
  });

  it('renders a hidden input with the correct locale', () => {
    const { container } = render(<FormWrapper>Test</FormWrapper>);
    const hiddenInput = container.querySelector(
      'input[type="hidden"][name="lang"]',
    ) as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('value', 'en');
  });
  it('renders a submit button with the correct text', () => {
    render(<FormWrapper>Test</FormWrapper>);
    const button = screen.getByTestId('continue-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('common.continue');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('renders a form with correct attributes', () => {
    render(<FormWrapper>Test</FormWrapper>);
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('action', '/api/form-handler');
    expect(form).toHaveAttribute('method', 'POST');
    expect(form).toHaveAttribute('novalidate');
  });
});
