import { render, screen } from '@testing-library/react';

import { ContactFormsLayout } from '.';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

const mockStep = 'mock-step';

describe('ContactFormsLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <ContactFormsLayout step={mockStep}>test content</ContactFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with a custom heading', () => {
    const { container } = render(
      <ContactFormsLayout step={mockStep} heading="Custom Heading">
        test content
      </ContactFormsLayout>,
    );
    expect(screen.getByTestId('layout-title')).toHaveTextContent(
      'Custom Heading',
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with the back link', () => {
    const { container } = render(
      <ContactFormsLayout step={mockStep} back="/back-link">
        test content
      </ContactFormsLayout>,
    );
    expect(screen.getByTestId('back-link')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const mockErrors = {
      'field-1': ['Field 1 is required'],
      'field-2': ['Field 2 is required'],
    };
    const { container } = render(
      <ContactFormsLayout errors={mockErrors} step={mockStep}>
        test content
      </ContactFormsLayout>,
    );
    expect(screen.getByTestId('error-summary-container')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
