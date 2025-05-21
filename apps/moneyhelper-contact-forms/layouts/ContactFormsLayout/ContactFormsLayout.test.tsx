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

describe('ContactFormsLayout', () => {
  const step = 'step-0';
  const flow = 'custom-flow';

  it('renders correctly', () => {
    const { container } = render(
      <ContactFormsLayout>test content</ContactFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders custom flow content driven by flow prop', () => {
    const { container } = render(
      <ContactFormsLayout flow={flow}>test content</ContactFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with custom flow heading', () => {
    const { container } = render(
      <ContactFormsLayout>test content</ContactFormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with the back link', () => {
    const { container } = render(
      <ContactFormsLayout back="/back-link">test content</ContactFormsLayout>,
    );
    expect(screen.getByTestId('back-link')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const mockErrors = [
      {
        field: 'name',
        message: 'Name is required',
      },
    ];
    const { container } = render(
      <ContactFormsLayout flow={flow} errors={mockErrors} step={step}>
        test content
      </ContactFormsLayout>,
    );
    expect(screen.getByTestId('error-callout')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
