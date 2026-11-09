import { siteConfig } from 'lib/mocks/siteConfig';
import { render } from '@testing-library/react';

import { SfsV3Layout } from './SfsV3Layout';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('SfsV3Layout', () => {
  it('renders correctly', () => {
    const { container } = render(
      <SfsV3Layout
        siteConfig={siteConfig}
        assetPath=""
        lang={'en'}
        slug={['/v3']}
        breadcrumbs={[
          {
            text: 'SFS V3',
            description: '',
            linkTo: '/v3',
          },
        ]}
      >
        <div data-testid="test-children">test children</div>
      </SfsV3Layout>,
    );

    expect(container).toMatchSnapshot();
  });
});
