import React from 'react';
import { render } from '@testing-library/react';
import { IconType } from '@maps-react/common/components/Icon';
import { CommonLinks } from '.';

describe('CommonLinks', () => {
  it('renders correctly', () => {
    const { container } = render(
      <CommonLinks
        title="Manage your information"
        links={[
          {
            title: 'Manage consent',
            href: '/en/manage-consent',
          },
          {
            title: 'Delegate access to a financial adviser',
            href: '/en/manage-consent',
          },
          {
            title: 'Make a complaint',
            href: '/en/complaints',
          },
          {
            title: 'Download my pension information (.pdf)',
            href: '/en/download-data',
            icon: IconType.DOWNLOAD,
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
