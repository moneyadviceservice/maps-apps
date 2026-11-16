import { ComponentProps } from 'react';

import { render, screen } from '@testing-library/react';

import { SiteConfigType } from 'lib/types/site.type';

import type { Analytics } from '@maps-react/core/components/Analytics';

import { BaseLayout } from './BaseLayout';

import '@testing-library/jest-dom';

const mockAnalytics = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

jest.mock('next/dist/client/resolve-href', () => ({
  resolveHref: () => [null, '/cy'],
}));

jest.mock('@maps-react/core/components/Analytics', () => ({
  Analytics: ({
    children,
    ...analyticsProps
  }: ComponentProps<typeof Analytics>) => {
    mockAnalytics(analyticsProps);
    return <>{children}</>;
  },
}));

const siteConfig: SiteConfigType = {
  seoTitle: 'Learning Pathway',
  seoDescription: 'Learning Pathway Description',
  navigation: [
    {
      text: 'Home',
      linkTo: '/',
      children: [],
    },
  ],
  headerLogo: {
    image: {
      _path: '/images/logo.svg',
      width: 186,
      height: 101,
      mimeType: 'image/svg+xml',
    },
    altText: 'MaPS Logo',
  },
  footerLinks: [
    {
      title: 'About',
      childLinks: [
        {
          text: 'Contact Us',
          linkTo: '/contact',
        },
      ],
    },
  ],
};

type AnalyticsProps = Omit<ComponentProps<typeof Analytics>, 'children'>;

const lastAnalyticsProps = (): AnalyticsProps => {
  const calls = mockAnalytics.mock.calls;
  return calls[calls.length - 1][0];
};

beforeEach(() => {
  mockAnalytics.mockClear();
});

describe('BaseLayout test', () => {
  it('should load the BaseLayout successfully', () => {
    const { container } = render(
      <BaseLayout
        bannerTitle="Debt Advice Quality Framework"
        title={'Learning pathway'}
        seoTitle="Learning pathway"
        seoDescription={'Learning Pathway'}
        assetPath={'http://localhost:3000'}
        siteConfig={siteConfig}
      >
        <p>Main content</p>
      </BaseLayout>,
    );

    expect(container).toMatchSnapshot();
  });

  it('renders the heading when site config has no navigation or footer links', () => {
    render(
      <BaseLayout
        bannerTitle="Debt Advice Quality Framework"
        title={'Learning pathway'}
        seoTitle={''}
        seoDescription={''}
        assetPath={''}
        siteConfig={{ seoTitle: '', seoDescription: '' } as SiteConfigType}
      >
        <p>Main content</p>
      </BaseLayout>,
    );

    expect(
      screen.getByRole('heading', { name: 'Learning pathway' }),
    ).toBeInTheDocument();
  });
});

describe('BaseLayout analytics', () => {
  it('tracks page load only', () => {
    render(
      <BaseLayout
        title={'Learning pathway'}
        seoTitle={'Framework'}
        seoDescription={''}
        assetPath={''}
        siteConfig={siteConfig}
        bannerTitle="Banner title"
      >
        <p>Main content</p>
      </BaseLayout>,
    );

    expect(lastAnalyticsProps().trackDefaults).toEqual({
      pageLoad: true,
      toolCompletion: false,
      toolStartRestart: false,
      errorMessage: false,
      emptyToolCompletion: false,
    });
  });

  it('sends the banner title as pageName and the seo title as pageTitle', () => {
    render(
      <BaseLayout
        seoTitle={'Framework | Debt Advice Quality Framework'}
        seoDescription={''}
        assetPath={''}
        siteConfig={siteConfig}
        bannerTitle={'Debt Advice Quality Framework'}
        categoryLevels={['Learning Pathway']}
      >
        <p>Main content</p>
      </BaseLayout>,
    );

    expect(lastAnalyticsProps().analyticsData.page).toEqual({
      pageName: 'Debt Advice Quality Framework',
      pageTitle: 'Framework | Debt Advice Quality Framework',
      pageType: 'Content page',
      categoryLevels: ['Learning Pathway'],
      site: 'maps',
    });
  });
});
