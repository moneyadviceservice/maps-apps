import { LinkType } from 'types/@adobe/components';
import { render, screen, within } from '@testing-library/react';

import { Breadcrumbs } from './Breadcrumbs';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: (key: { en: string; cy: string }) => key.en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const mockBreadcrumbs: LinkType[] = [
  {
    linkTo: 'https://maps.org.uk/',
    text: 'Home',
    externalLink: true,
    description: 'Home page',
  },
  {
    linkTo: 'tool',
    text: 'Tools and research',
    externalLink: false,
    description: 'Tools and research section',
  },
  {
    linkTo: 'evidence-hub',
    text: 'Research Library',
    externalLink: false,
    description: 'Research Library section',
  },
];

describe('Breadcrumbs', () => {
  it('renders null when breadcrumbs array is empty', () => {
    const { container } = render(<Breadcrumbs breadcrumbs={[]} lang="en" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders null when breadcrumbs is undefined', () => {
    const { container } = render(
      <Breadcrumbs
        breadcrumbs={undefined as unknown as LinkType[]}
        lang="en"
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders null when breadcrumbs is null', () => {
    const { container } = render(
      <Breadcrumbs breadcrumbs={null as unknown as LinkType[]} lang="en" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders breadcrumbs with external links', () => {
    const externalBreadcrumbs: LinkType[] = [
      {
        linkTo: 'https://maps.org.uk/',
        text: 'External Home',
        externalLink: true,
        description: 'External home page',
      },
    ];

    render(<Breadcrumbs breadcrumbs={externalBreadcrumbs} lang="en" />);

    // Test desktop version (more specific query)
    const desktopNav = screen.getByTestId('breadcrumb-desktop');
    const breadcrumbLink = within(desktopNav).getByRole('link', {
      name: 'External Home',
    });
    expect(breadcrumbLink).toHaveAttribute('href', 'https://maps.org.uk/');
    expect(breadcrumbLink).toHaveTextContent('External Home');
  });

  it('renders breadcrumbs with root/empty links', () => {
    const rootBreadcrumbs: LinkType[] = [
      {
        linkTo: '/',
        text: 'Root Link',
        externalLink: false,
        description: 'Root page',
      },
      {
        linkTo: '',
        text: 'Empty Link',
        externalLink: false,
        description: 'Empty link',
      },
    ];

    render(<Breadcrumbs breadcrumbs={rootBreadcrumbs} lang="cy" />);

    const desktopNav = screen.getByTestId('breadcrumb-desktop');
    const rootBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'Root Link',
    });
    expect(rootBreadcrumb).toHaveAttribute('href', '/cy');
    expect(rootBreadcrumb).toHaveTextContent('Root Link');

    const emptyBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'Empty Link',
    });
    expect(emptyBreadcrumb).toHaveAttribute('href', '/cy');
    expect(emptyBreadcrumb).toHaveTextContent('Empty Link');
  });

  it('renders breadcrumbs with internal links', () => {
    const internalBreadcrumbs: LinkType[] = [
      {
        linkTo: 'tool',
        text: 'Tools',
        externalLink: false,
        description: 'Tools page',
      },
      {
        linkTo: '/evidence-hub',
        text: 'Evidence Hub',
        externalLink: false,
        description: 'Evidence Hub page',
      },
    ];

    render(<Breadcrumbs breadcrumbs={internalBreadcrumbs} lang="en" />);

    const desktopNav = screen.getByTestId('breadcrumb-desktop');
    const toolBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'Tools',
    });
    expect(toolBreadcrumb).toHaveAttribute('href', '/en/tool');
    expect(toolBreadcrumb).toHaveTextContent('Tools');

    const evidenceBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'Evidence Hub',
    });
    expect(evidenceBreadcrumb).toHaveAttribute('href', '/en/evidence-hub');
    expect(evidenceBreadcrumb).toHaveTextContent('Evidence Hub');
  });

  it('handles mixed breadcrumb types', () => {
    const mixedBreadcrumbs: LinkType[] = [
      {
        linkTo: 'https://maps.org.uk/',
        text: 'External Home',
        externalLink: true,
        description: 'External home',
      },
      {
        linkTo: '/',
        text: 'Root',
        externalLink: false,
        description: 'Root page',
      },
      {
        linkTo: 'internal-page',
        text: 'Internal',
        externalLink: false,
        description: 'Internal page',
      },
    ];

    render(<Breadcrumbs breadcrumbs={mixedBreadcrumbs} lang="fr" />);

    const desktopNav = screen.getByTestId('breadcrumb-desktop');
    const externalBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'External Home',
    });
    expect(externalBreadcrumb).toHaveAttribute('href', 'https://maps.org.uk/');
    expect(externalBreadcrumb).toHaveTextContent('External Home');

    const rootBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'Root',
    });
    expect(rootBreadcrumb).toHaveAttribute('href', '/fr');
    expect(rootBreadcrumb).toHaveTextContent('Root');

    const internalBreadcrumb = within(desktopNav).getByRole('link', {
      name: 'Internal',
    });
    expect(internalBreadcrumb).toHaveAttribute('href', '/fr/internal-page');
    expect(internalBreadcrumb).toHaveTextContent('Internal');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <Breadcrumbs breadcrumbs={mockBreadcrumbs} lang="en" />,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('-ml-2');
  });

  it('handles different languages correctly', () => {
    const breadcrumbs: LinkType[] = [
      {
        linkTo: 'test-page',
        text: 'Test Page',
        externalLink: false,
        description: 'Test page',
      },
    ];

    render(<Breadcrumbs breadcrumbs={breadcrumbs} lang="cy" />);

    const desktopNav = screen.getByTestId('breadcrumb-desktop');
    const breadcrumb = within(desktopNav).getByRole('link', {
      name: 'Test Page',
    });
    expect(breadcrumb).toHaveAttribute('href', '/cy/test-page');
  });

  it.each([
    {
      linkTo: '/page-with-slash',
      text: 'Page With Slash',
      expectedHref: '/en/page-with-slash',
      description: 'handles links with leading slashes',
    },
    {
      linkTo: 'page-without-slash',
      text: 'Page Without Slash',
      expectedHref: '/en/page-without-slash',
      description: 'handles links without leading slashes',
    },
  ])('$description', ({ linkTo, text, expectedHref }) => {
    const breadcrumbs: LinkType[] = [
      {
        linkTo,
        text,
        externalLink: false,
        description: `Page with ${
          linkTo.startsWith('/') ? 'leading' : 'no leading'
        } slash`,
      },
    ];

    render(<Breadcrumbs breadcrumbs={breadcrumbs} lang="en" />);

    const desktopNav = screen.getByTestId('breadcrumb-desktop');
    const breadcrumb = within(desktopNav).getByRole('link', { name: text });
    expect(breadcrumb).toHaveAttribute('href', expectedHref);
  });

  it('renders with original mock data and matches snapshot', () => {
    const { container } = render(
      <Breadcrumbs breadcrumbs={mockBreadcrumbs} lang="en" />,
    );

    expect(container).toMatchSnapshot();
  });
});
