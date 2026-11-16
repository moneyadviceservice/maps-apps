import { render, screen } from '@testing-library/react';

import { FormsLayout } from './FormsLayout';

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

const mockErrors = {
  'field-1': ['Field 1 is required'],
  'field-2': ['Field 2 is required'],
};

describe('FormsLayout', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.close = jest.fn();
  });

  it('renders correctly', () => {
    const { container } = render(
      <FormsLayout step="step-0">test content</FormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with a custom heading', () => {
    const { container } = render(
      <FormsLayout step="step-0" heading="Custom Heading">
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('layout-title')).toHaveTextContent(
      'Custom Heading',
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with the back link', () => {
    const { container } = render(
      <FormsLayout step="step-0" back="/back-link">
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('tool-nav-prev')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders with an external back link', () => {
    render(
      <FormsLayout step="step-0" back="https://external-link">
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('tool-nav-prev')).toHaveAttribute(
      'href',
      'https://external-link',
    );
  });

  it('renders with errors', () => {
    const { container } = render(
      <FormsLayout errors={mockErrors} step="step-0">
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('error-summary-container')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
