import { render, screen } from '@testing-library/react';

import { mockErrors, mockSteps } from '../../mocks';
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

describe('FormsLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <FormsLayout step={mockSteps[0]}>test content</FormsLayout>,
    );
    expect(container).toMatchSnapshot();
  });
  it('does not render layoutContent when flag is false (default)', () => {
    render(
      <FormsLayout step={mockSteps[0]} layoutContent="Layout Content">
        test content
      </FormsLayout>,
    );
    expect(screen.queryByTestId('layout-content')).not.toBeInTheDocument();
  });

  it('renders layoutContent only when flag is true and content provided', () => {
    const { container } = render(
      <FormsLayout
        step={mockSteps[0]}
        hasLayoutContent={true}
        layoutContent="Layout Content"
      >
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('layout-content')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('does not render layoutContent when flag is true but content is empty', () => {
    render(
      <FormsLayout step={mockSteps[0]} hasLayoutContent layoutContent="">
        test content
      </FormsLayout>,
    );
    expect(screen.queryByTestId('layout-content')).not.toBeInTheDocument();
  });

  it('renders with a custom heading', () => {
    const { container } = render(
      <FormsLayout step={mockSteps[0]} heading="Custom Heading">
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
      <FormsLayout step={mockSteps[0]} back="/back-link">
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('back-link')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders with errors', () => {
    const { container } = render(
      <FormsLayout errors={mockErrors} step={mockSteps[0]}>
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('error-summary-container')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders without a sidebar when not configured', () => {
    const { queryByTestId } = render(
      <FormsLayout step={mockSteps[1]}>test content</FormsLayout>,
    );
    expect(queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders the sidebar when passed', () => {
    const sidebar = <div data-testid="sidebar-content">Sidebar Content</div>;
    render(
      <FormsLayout step={mockSteps[0]} sidebar={sidebar}>
        test content
      </FormsLayout>,
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
  });
});
