import { render } from '@testing-library/react';

import { ImageLinkGroup } from './ImageLinkGroup';

describe('ImageLinkGroup component', () => {
  it('renders correctly', () => {
    render(
      <ImageLinkGroup
        title="test"
        org={[
          {
            link: {
              linkTo: 'https://aib.gov.uk/',
              text: 'Accountant in Bankruptcy',
              description: 'Accountant in Bankruptcy',
            },
            governanceLogo: {
              image: {
                _path:
                  '/content/dam/sfs/assets/governance-orgs/accountant-bankruptcy.png',
                width: 234,
                height: 108,
                mimeType: 'image/png',
              },
              altText: 'Accountant in Bankruptcy',
            },
          },
        ]}
        assetPath=""
      />,
    );
  });
});
