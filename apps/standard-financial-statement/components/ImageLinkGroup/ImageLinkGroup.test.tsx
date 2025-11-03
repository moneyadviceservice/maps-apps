import { OrganisationType } from 'types/@adobe/page';

import { fireEvent, render } from '@testing-library/react';

import { ImageLinkGroup } from './ImageLinkGroup';

const mockAddEvent = jest.fn();
jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

const orgMock = [
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
];

describe('ImageLinkGroup component', () => {
  it('renders correctly', () => {
    render(<ImageLinkGroup title="test" org={orgMock} assetPath="" />);
  });

  it('calls analytics addEvent when a link is clicked', () => {
    const { getAllByRole } = render(
      <ImageLinkGroup title="test" org={orgMock} assetPath="" />,
    );
    // There are two links per org, test the first one
    const links = getAllByRole('link');
    fireEvent.click(links[0]);
    expect(mockAddEvent).toHaveBeenCalledWith({
      event: 'externalClicks',
      eventInfo: {
        linkText: orgMock[0].link.text,
        destinationURL: orgMock[0].link.linkTo,
      },
    });
  });

  it('does not render anything if org is missing both link and governanceLogo', () => {
    const orgMissingBoth = [
      {
        link: undefined,
        governanceLogo: undefined,
      } as unknown as OrganisationType,
    ];
    const { container } = render(
      <ImageLinkGroup title="test" org={orgMissingBoth} assetPath="" />,
    );
    // Should not render any links or images
    expect(container.querySelector('a')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
  });
});
