import { render, screen } from '@testing-library/react';
import { HomepageLayout } from './HomepageLayout';

import '@testing-library/jest-dom';

const mockPage = {
  title: 'Test Homepage Title',
  seoTitle: 'Test Homepage Title',
  seoDescription: 'Test Homepage Description',
  breadcrumbs: [],
  description: {
    json: [
      {
        nodeType: 'paragraph',
        content: [{ nodeType: 'text', value: 'Test description', marks: [] }],
      },
    ],
  },
  cards: [
    {
      title: 'Card 1',
      description: {
        json: [
          {
            nodeType: 'paragraph',
            content: [
              { nodeType: 'text', value: 'Card description', marks: [] },
            ],
          },
        ],
      },
      image: {
        image: {
          _path: '/content/dam/test-image.jpg',
          width: 800,
          height: 600,
          mimeType: 'image/jpeg',
        },
        altText: 'Card 1 image',
      },
      link: {
        linkTo: 'card-1',
        text: 'View Card',
        description: null,
        externalLink: false,
      },
    },
  ],
  video: {
    title: 'Video Section',
    videoUrl: 'https://www.youtube.com/embed/test-video',
    transcriptTitle: 'Video Transcript',
    transcript: {
      json: [
        {
          nodeType: 'paragraph',
          content: [
            { nodeType: 'text', value: 'Video transcript content', marks: [] },
          ],
        },
      ],
    },
  },
  content: {
    json: [
      {
        nodeType: 'paragraph',
        content: [
          { nodeType: 'text', value: 'Content information', marks: [] },
        ],
      },
    ],
  },
};

describe('HomepageLayout', () => {
  const defaultProps = {
    page: mockPage,
    assetPath: '/asset-path',
    lang: 'en',
  };

  it('renders the hero section with title and description', () => {
    render(<HomepageLayout {...defaultProps} />);

    expect(screen.getByTestId('homepage-heading')).toHaveTextContent(
      'Test Homepage Title',
    );
    expect(screen.getByTestId('homepage-description')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders the cards section', () => {
    render(<HomepageLayout {...defaultProps} />);

    expect(screen.getByTestId('cards-section')).toBeInTheDocument();
    expect(screen.getByTestId('card-0')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
  });

  it('renders the video section', () => {
    render(<HomepageLayout {...defaultProps} />);

    expect(screen.getByTestId('video-section')).toBeInTheDocument();
    expect(screen.getByTestId('video-heading')).toHaveTextContent(
      'Video Section',
    );
    expect(screen.getByTestId('homepage-video')).toBeInTheDocument();
  });

  it('renders the content section', () => {
    render(<HomepageLayout {...defaultProps} />);

    expect(screen.getByTestId('content-section')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Content information')).toBeInTheDocument();
  });

  it('renders multiple cards', () => {
    const pageWithMultipleCards = {
      ...mockPage,
      cards: [
        ...mockPage.cards,
        {
          title: 'Card 2',
          description: {
            json: [
              {
                nodeType: 'paragraph',
                content: [
                  {
                    nodeType: 'text',
                    value: 'Second card description',
                    marks: [],
                  },
                ],
              },
            ],
          },
          image: {
            image: {
              _path: '/content/dam/card-2.jpg',
              width: 800,
              height: 600,
              mimeType: 'image/jpeg',
            },
            altText: 'Card 2 image',
          },
          link: {
            linkTo: 'card-2',
            text: 'View Card 2',
            description: null,
            externalLink: false,
          },
        },
      ],
    };

    render(
      <HomepageLayout {...{ ...defaultProps, page: pageWithMultipleCards }} />,
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  it('handles missing optional sections gracefully', () => {
    const pageWithoutSections = {
      title: 'Test Homepage',
      seoTitle: 'Test Homepage',
      seoDescription: 'Test description',
      breadcrumbs: [],
      description: {
        json: [
          {
            nodeType: 'paragraph',
            content: [{ nodeType: 'text', value: '', marks: [] }],
          },
        ],
      },
      cards: [],
      video: undefined,
      content: undefined,
    };

    render(
      <HomepageLayout {...{ ...defaultProps, page: pageWithoutSections }} />,
    );

    expect(screen.getByTestId('homepage-heading')).toHaveTextContent(
      'Test Homepage',
    );
    // Should not render empty sections
    expect(screen.queryByTestId('cards-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('video-section')).not.toBeInTheDocument();
    expect(screen.queryByTestId('content-section')).not.toBeInTheDocument();
  });

  it('renders cards with external links correctly', () => {
    const pageWithExternalLink = {
      ...mockPage,
      cards: [
        {
          ...mockPage.cards[0],
          link: {
            ...mockPage.cards[0].link,
            externalLink: true,
            linkTo: 'https://external-site.com/page',
          },
        },
      ],
    };

    render(
      <HomepageLayout {...{ ...defaultProps, page: pageWithExternalLink }} />,
    );

    const link = screen.getByTestId('card-0').closest('a');
    expect(link).toHaveAttribute('href', 'https://external-site.com/page');
  });

  it('renders cards without images gracefully', () => {
    const pageWithoutImage = {
      ...mockPage,
      cards: [
        {
          title: 'Card without image',
          description: mockPage.cards[0].description,
          image: {
            image: {
              _path: '',
              width: 0,
              height: 0,
              mimeType: '',
            },
            altText: '',
          },
          link: mockPage.cards[0].link,
        },
      ],
    };

    render(<HomepageLayout {...{ ...defaultProps, page: pageWithoutImage }} />);

    expect(screen.getByText('Card without image')).toBeInTheDocument();
  });

  it('renders cards without description json gracefully', () => {
    const pageWithoutDescription = {
      ...mockPage,
      cards: [
        {
          ...mockPage.cards[0],
          description: {
            json: [],
          },
        },
      ],
    };

    render(
      <HomepageLayout {...{ ...defaultProps, page: pageWithoutDescription }} />,
    );

    expect(screen.getByText('Card 1')).toBeInTheDocument();
  });

  it('renders with Welsh language prefix', () => {
    render(<HomepageLayout {...{ ...defaultProps, lang: 'cy' }} />);

    const link = screen.getByTestId('card-0').closest('a');
    expect(link).toHaveAttribute('href', '/cy/card-1');
  });

  it('handles video without videoUrl', () => {
    const pageWithVideoWithoutUrl = {
      ...mockPage,
      video: {
        ...mockPage.video,
        videoUrl: undefined,
      },
    };

    render(
      <HomepageLayout
        {...{ ...defaultProps, page: pageWithVideoWithoutUrl }}
      />,
    );

    expect(screen.getByTestId('video-section')).toBeInTheDocument();
  });
});
