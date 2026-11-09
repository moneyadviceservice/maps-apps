import { siteConfig } from 'lib/mocks/siteConfig';
import { render } from '@testing-library/react';

import { BasePageLayout } from '.';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
}));

describe('BasePageLayout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <BasePageLayout
        siteConfig={siteConfig}
        assetPath=""
        pageTitle="test"
        breadcrumbs={[]}
        lang="en"
        slug={['/test']}
      >
        test content
      </BasePageLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});
