import React from 'react';
import { render } from '@testing-library/react';
import { PensionsDashboardLayout } from '.';

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
});
