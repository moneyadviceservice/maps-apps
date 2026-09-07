import { render, screen } from '@testing-library/react';

import { PensionsDashboardLayout } from '.';

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

jest.mock('../../public/images/hs-card-1.jpg', () => ({
  src: '/images/hs-card-1.jpg',
  width: 100,
  height: 100,
}));

jest.mock('../../public/images/hs-card-2.jpg', () => ({
  src: '/images/hs-card-2.jpg',
  width: 100,
  height: 100,
}));

jest.mock('../../public/images/hs-card-3.jpg', () => ({
  src: '/images/hs-card-3.jpg',
  width: 100,
  height: 100,
}));

describe('PensionsDashboardLayout', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.close = jest.fn();
  });
  const title = 'test title';
  const breadcrumb = [{ label: 'test breadcrumb', link: '/test-breadcrumb' }];

  it('renders correctly', () => {
    const { container } = render(
      <PensionsDashboardLayout title={title}>
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.queryByTestId('help-and-support')).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders with the breadcrumb', () => {
    const { container } = render(
      <PensionsDashboardLayout title={title} breadcrumb={breadcrumb}>
        test content
      </PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('does not contain heading when title is not provided', () => {
    const { container, getByTestId } = render(
      <PensionsDashboardLayout>test content</PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
    expect(() => getByTestId('page-title')).toThrow();
  });

  it('has heading when title is provided', () => {
    const { container, getByTestId } = render(
      <PensionsDashboardLayout title="test title">
        test content
      </PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
    expect(getByTestId('page-title')).toBeInTheDocument();
    expect(getByTestId('page-title')).toHaveTextContent('test title');
  });

  it('renders with the back link when provided', () => {
    render(
      <PensionsDashboardLayout title={title} back="/back-link">
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('back')).toBeInTheDocument();
  });

  it('renders with the home link when provided', () => {
    render(
      <PensionsDashboardLayout title={title} homeLink>
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('home-link')).toBeInTheDocument();
  });

  it('renders the help and support link', () => {
    render(
      <PensionsDashboardLayout title={title} helpAndSupport>
        test content
      </PensionsDashboardLayout>,
    );
    const link = screen.getByTestId('help-and-support-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#help-and-support');
    expect(
      screen.queryByTestId('download-pension-information-link'),
    ).not.toBeInTheDocument();
  });

  it('renders the download pension information link when enabled', () => {
    render(
      <PensionsDashboardLayout title={title} helpAndSupport showDownloadLink>
        test content
      </PensionsDashboardLayout>,
    );
    const link = screen.getByTestId('download-pension-information-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/en/feature-not-available');
  });

  it('renders the help and support section', () => {
    render(
      <PensionsDashboardLayout title={title} helpAndSupport>
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('help-and-support')).toBeInTheDocument();
  });

  it('renders the back to top link', () => {
    render(
      <PensionsDashboardLayout title={title} toTopLink>
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it('does not render the timeout functionality if excluded', () => {
    const { container } = render(
      <PensionsDashboardLayout
        title={title}
        helpAndSupport
        enableTimeOut={false}
      >
        test content
      </PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('does not render the logged in link if page is a logged in page', () => {
    render(
      <PensionsDashboardLayout isLoggedInPage={false}>
        test content
      </PensionsDashboardLayout>,
    );
    const logoutLink = screen.queryByTestId('logout-link');
    expect(logoutLink).not.toBeInTheDocument();
  });

  it('renders the full width page layout if isOffset is set to false', () => {
    const container = render(
      <PensionsDashboardLayout isOffset={false}>
        test content
      </PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the bottom tabs', () => {
    render(
      <PensionsDashboardLayout
        title={title}
        toTopLink
        showTabsNavigation={true}
      >
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('bottom-tabs')).toBeInTheDocument();
  });

  it('renders the language switcher', () => {
    render(
      <PensionsDashboardLayout title={title} showTabsNavigation={true}>
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('does not render the tool feedback component when showToolFeedBack is false', () => {
    const { queryByTestId } = render(
      <PensionsDashboardLayout title={title} showToolFeedBack={false}>
        test content
      </PensionsDashboardLayout>,
    );
    expect(queryByTestId('tool-feedback')).not.toBeInTheDocument();
  });

  it('renders the dashboard navigation', () => {
    render(
      <PensionsDashboardLayout title={title} homeLink>
        test content
      </PensionsDashboardLayout>,
    );
    expect(screen.getByTestId('dashboard-nav')).toBeInTheDocument();
  });
});
