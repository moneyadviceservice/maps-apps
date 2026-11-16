import { PageTemplate } from 'types/@adobe/page';
import { render, screen } from '@testing-library/react';

import { PageLayout } from './PageLayout';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: (key: { en: string; cy: string }) => key.en,
  }),
  __esModule: true,
  default: jest.fn().mockReturnValue({
    z: (key: { en: string; cy: string }) => key.en,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const page: PageTemplate = {
  seoTitle: 'SEO Title',
  seoDescription: 'SEO description',
  title: 'Sample Doc',
  slug: 'sample-doc',
  breadcrumbs: [],
  sections: [],
};

describe('PageLayout', () => {
  it('renders page title', () => {
    render(<PageLayout page={page} />);

    const heading = screen.getByTestId('main-heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(page.title);
  });

  it('renders overview when available', () => {
    const pageWithOverview = {
      ...page,
      overview: {
        json: [
          {
            nodeType: 'paragraph',
            content: [{ nodeType: 'text', value: 'This is an overview' }],
          },
        ],
      },
    };

    render(<PageLayout page={pageWithOverview} />);

    const description = screen.getByTestId('page-description');
    expect(description).toBeInTheDocument();
  });

  it('renders navigation links when sections have headers', () => {
    const pageWithSections = {
      ...page,
      sections: [
        {
          json: [
            {
              nodeType: 'header',
              style: 'h2',
              content: [{ nodeType: 'text', value: 'Section One Example' }],
            },
            {
              nodeType: 'paragraph',
              content: [
                { nodeType: 'text', value: 'Content for section one example' },
              ],
            },
          ],
        },
        {
          json: [
            {
              nodeType: 'header',
              style: 'h2',
              content: [{ nodeType: 'text', value: 'Section Two Example' }],
            },
            {
              nodeType: 'paragraph',
              content: [
                { nodeType: 'text', value: 'Content for section two example' },
              ],
            },
          ],
        },
      ],
    };

    render(<PageLayout page={pageWithSections} />);

    expect(screen.getByText('On this page')).toBeInTheDocument();

    const sectionOneLink = screen.getByRole('link', {
      name: 'Section One Example',
    });
    expect(sectionOneLink).toBeInTheDocument();
    expect(sectionOneLink).toHaveAttribute('href', '#SectionOneExample');

    const sectionTwoLink = screen.getByRole('link', {
      name: 'Section Two Example',
    });
    expect(sectionTwoLink).toBeInTheDocument();
    expect(sectionTwoLink).toHaveAttribute('href', '#SectionTwoExample');
  });

  it('does not render navigation when no sections have h2 headers', () => {
    const pageWithSectionsNoHeaders = {
      ...page,
      sections: [
        {
          json: [
            {
              nodeType: 'paragraph',
              content: [
                { nodeType: 'text', value: 'Content without header example' },
              ],
            },
          ],
        },
      ],
    };

    render(<PageLayout page={pageWithSectionsNoHeaders} />);

    expect(screen.queryByText('On this page')).not.toBeInTheDocument();
  });

  it('handles sections with headers that have no content', () => {
    const pageWithEmptyHeaders = {
      ...page,
      sections: [
        {
          json: [
            {
              nodeType: 'header',
              style: 'h2',
              content: [],
            },
          ],
        },
      ],
    };

    render(<PageLayout page={pageWithEmptyHeaders} />);

    expect(screen.queryByText('On this page')).not.toBeInTheDocument();
  });

  it('handles sections with headers that have no value', () => {
    const pageWithHeadersNoValue = {
      ...page,
      sections: [
        {
          json: [
            {
              nodeType: 'header',
              style: 'h2',
              content: [{ nodeType: 'text', value: undefined }],
            },
          ],
        },
      ],
    };

    render(<PageLayout page={pageWithHeadersNoValue} />);

    expect(screen.queryByText('On this page')).not.toBeInTheDocument();
  });

  it('filters out header elements from section content', () => {
    const pageWithMixedContent = {
      ...page,
      sections: [
        {
          json: [
            {
              nodeType: 'header',
              style: 'h2',
              content: [{ nodeType: 'text', value: 'Section Header Example' }],
            },
            {
              nodeType: 'paragraph',
              content: [
                { nodeType: 'text', value: 'This should remain example' },
              ],
            },
            {
              nodeType: 'header',
              style: 'h2',
              content: [{ nodeType: 'text', value: 'Another Header Example' }],
            },
          ],
        },
      ],
    };

    render(<PageLayout page={pageWithMixedContent} />);

    // Should only show one navigation link (the first header)
    const sectionHeaderLink = screen.getByRole('link', {
      name: 'Section Header Example',
    });
    expect(sectionHeaderLink).toBeInTheDocument();
    expect(
      screen.queryByText('Another Header Example'),
    ).not.toBeInTheDocument();
  });

  it('handles empty sections array', () => {
    const pageWithEmptySections = {
      ...page,
      sections: [],
    };

    render(<PageLayout page={pageWithEmptySections} />);

    expect(screen.queryByText('On this page')).not.toBeInTheDocument();
  });

  it('handles undefined sections', () => {
    const pageWithUndefinedSections = {
      ...page,
      sections: undefined,
    } as unknown as PageTemplate;

    render(<PageLayout page={pageWithUndefinedSections} />);

    expect(screen.queryByText('On this page')).not.toBeInTheDocument();
  });

  it('handles sections with undefined json', () => {
    const pageWithUndefinedJson = {
      ...page,
      sections: [
        {
          json: undefined,
        } as unknown as PageTemplate['sections'][0],
      ],
    };

    render(<PageLayout page={pageWithUndefinedJson} />);

    expect(screen.queryByText('On this page')).not.toBeInTheDocument();
  });
});
