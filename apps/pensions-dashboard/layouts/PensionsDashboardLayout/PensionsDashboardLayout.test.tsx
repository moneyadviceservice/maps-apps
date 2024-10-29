import React from 'react';
import { render } from '@testing-library/react';
import { PensionsDashboardLayout } from '.';

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

describe('PensionsDashboardLayout', () => {
  const title = 'test title';
  const breadcrumb = [{ label: 'test breadcrumb', link: '/test-breadcrumb' }];

  it('renders correctly', () => {
    const { container } = render(
      <PensionsDashboardLayout title={title}>
        test content
      </PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with the common links', () => {
    const { container } = render(
      <PensionsDashboardLayout title={title} showCommonLinks={true}>
        test content
      </PensionsDashboardLayout>,
    );
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

  it('sets the page title when title is not provided', () => {
    const { container } = render(
      <PensionsDashboardLayout>test content</PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with the back link when provided', () => {
    const { container } = render(
      <PensionsDashboardLayout title={title} backLink="/back-link">
        test content
      </PensionsDashboardLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
