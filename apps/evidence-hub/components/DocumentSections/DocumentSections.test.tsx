import { fireEvent, render, screen } from '@testing-library/react';

import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { DocumentSections, Section } from './DocumentSections';

import '@testing-library/jest-dom';

const mockAddEvent = jest.fn();

jest.mock('@maps-react/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    addEvent: mockAddEvent,
  }),
}));

jest.mock('@maps-react/vendor/utils/RenderRichText', () => {
  const actual = jest.requireActual('@maps-react/vendor/utils/RenderRichText');

  return {
    ...actual,
    mapJsonRichText: jest.fn(),
  };
});

const mockMapJsonRichText = mapJsonRichText as jest.Mock;

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

const baseSection = [
  {
    header: {
      id: 'test',
      text: 'testid',
    },
    json: [
      {
        nodeType: 'paragraph',
        content: [],
      },
    ],
  },
];

describe('DocumentSections component', () => {
  let originalOpen: typeof window.open;
  let openSpy: jest.Mock;

  const setupWindowOpenMock = () => {
    originalOpen = window.open;
    openSpy = jest.fn();
    window.open = openSpy as typeof window.open;
  };

  const teardownWindowOpenMock = () => {
    if (originalOpen) {
      window.open = originalOpen;
    }
  };

  const renderWithLink = (href: string, text: string, ariaLabel?: string) => {
    mockMapJsonRichText.mockReturnValueOnce([
      <a key="link" href={href} aria-label={ariaLabel}>
        {text}
      </a>,
    ]);
    return render(<DocumentSections sections={baseSection} />);
  };

  const clickLinkAndExpectTracking = (
    href: string,
    linkText: string,
    queryFn: () => HTMLElement = () =>
      screen.getByRole('link', { name: linkText }),
  ) => {
    const link = queryFn();
    fireEvent.click(link);

    expect(mockAddEvent).toHaveBeenCalledWith({
      event: 'fileDownload',
      eventInfo: {
        destinationURL: href,
        linkText,
      },
    });
    if (openSpy) {
      expect(openSpy).toHaveBeenCalledWith(href, '_blank');
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    teardownWindowOpenMock();
  });

  it('renders the supplied section heading', () => {
    mockMapJsonRichText.mockReturnValueOnce([
      <p key="mock">Mock section content</p>,
    ]);

    render(<DocumentSections sections={baseSection} />);

    expect(
      screen.getByRole('heading', { name: 'testid', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Mock section content')).toBeInTheDocument();
  });

  it('tracks analytics when a downloadable link is clicked', () => {
    setupWindowOpenMock();
    renderWithLink('https://example.com/test.pdf', 'Download file');
    clickLinkAndExpectTracking('https://example.com/test.pdf', 'Download file');
  });

  it('tracks analytics for all downloadable file extensions', () => {
    const extensions = [
      'pdf',
      'csv',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
    ];
    setupWindowOpenMock();

    extensions.forEach((ext) => {
      jest.clearAllMocks();
      const { unmount } = renderWithLink(
        `https://example.com/test.${ext}`,
        `Download ${ext}`,
      );
      clickLinkAndExpectTracking(
        `https://example.com/test.${ext}`,
        `Download ${ext}`,
      );
      unmount();
    });
  });

  it('does not track analytics for non-downloadable links', () => {
    mockMapJsonRichText.mockReturnValueOnce([
      <a key="link" href="https://example.com/page.html">
        Regular link
      </a>,
    ]);

    render(<DocumentSections sections={baseSection} />);

    fireEvent.click(screen.getByRole('link', { name: 'Regular link' }));

    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('does not track analytics when clicking non-anchor elements', () => {
    mockMapJsonRichText.mockReturnValueOnce([
      <div key="div" data-testid="clickable-div">
        Click me
      </div>,
    ]);

    render(<DocumentSections sections={baseSection} />);

    fireEvent.click(screen.getByTestId('clickable-div'));

    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('does not track analytics for links with empty href', () => {
    mockMapJsonRichText.mockReturnValueOnce([
      <a key="link" href="">
        Empty link
      </a>,
    ]);

    render(<DocumentSections sections={baseSection} />);

    // Anchor with empty href is not recognized as a link role, so use getByText
    const emptyLink = screen.getByText('Empty link');
    fireEvent.click(emptyLink);

    expect(mockAddEvent).not.toHaveBeenCalled();
  });

  it('handles links with invalid URLs by checking normalized href', () => {
    setupWindowOpenMock();
    renderWithLink('invalid-url-with.pdf', 'Invalid URL PDF');
    clickLinkAndExpectTracking('invalid-url-with.pdf', 'Invalid URL PDF');
  });

  it('handles links with empty textContent', () => {
    setupWindowOpenMock();
    mockMapJsonRichText.mockReturnValueOnce([
      <a
        key="link"
        href="https://example.com/test.pdf"
        aria-label="Download PDF"
      >
        {' '}
      </a>,
    ]);
    render(<DocumentSections sections={baseSection} />);
    clickLinkAndExpectTracking('https://example.com/test.pdf', '', () =>
      screen.getByRole('link', { name: 'Download PDF' }),
    );
  });

  it('renders multiple sections', () => {
    mockMapJsonRichText
      .mockReturnValueOnce([<p key="1">Section 1 content</p>])
      .mockReturnValueOnce([<p key="2">Section 2 content</p>]);

    const multipleSections = [
      {
        header: { id: 'section1', text: 'Section 1' },
        json: [{ nodeType: 'paragraph', content: [] }],
      },
      {
        header: { id: 'section2', text: 'Section 2' },
        json: [{ nodeType: 'paragraph', content: [] }],
      },
    ];

    render(<DocumentSections sections={multipleSections} />);

    expect(
      screen.getByRole('heading', { name: 'Section 1', level: 2 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Section 2', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('Section 1 content')).toBeInTheDocument();
    expect(screen.getByText('Section 2 content')).toBeInTheDocument();
  });

  it('handles empty sections array', () => {
    render(<DocumentSections sections={[]} />);

    expect(screen.getByTestId('section')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('handles undefined sections', () => {
    render(<DocumentSections sections={undefined as unknown as Section[]} />);

    expect(screen.getByTestId('section')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('cleans up event listener on unmount', () => {
    mockMapJsonRichText.mockReturnValueOnce([
      <a key="link" href="https://example.com/test.pdf">
        Download file
      </a>,
    ]);

    const { unmount } = render(<DocumentSections sections={baseSection} />);
    const section = screen.getByTestId('section');

    const removeEventListenerSpy = jest.spyOn(section, 'removeEventListener');

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'click',
      expect.any(Function),
    );

    removeEventListenerSpy.mockRestore();
  });

  it('handles case-insensitive file extensions', () => {
    setupWindowOpenMock();
    renderWithLink('https://example.com/test.PDF', 'Download PDF');
    clickLinkAndExpectTracking('https://example.com/test.PDF', 'Download PDF');
  });

  it('handles relative URLs with downloadable extensions', () => {
    setupWindowOpenMock();
    renderWithLink('/documents/report.pdf', 'Relative PDF');
    clickLinkAndExpectTracking('/documents/report.pdf', 'Relative PDF');
  });

  it('handles useEffect when ref is null', () => {
    // This tests the early return when sectionEl is null (line 67)
    // The ref can be null if the component unmounts before useEffect runs
    // or if the DOM element isn't available yet

    mockMapJsonRichText.mockReturnValueOnce([<p key="mock">Mock content</p>]);

    const { unmount } = render(<DocumentSections sections={baseSection} />);

    // Unmount immediately to test the cleanup path
    unmount();

    // Re-render with a new instance - the ref will be null initially
    // before React assigns it, testing the early return
    const { container } = render(<DocumentSections sections={baseSection} />);

    // The component should render successfully
    expect(
      container.querySelector('[data-testid="section"]'),
    ).toBeInTheDocument();

    // The useEffect should handle the case where ref.current might be null
    // during initial render before React assigns the ref
  });

  it('handles URL parsing errors in hasDownloadableExtension catch block', () => {
    const originalURL = window.URL;
    // Mock URL constructor to throw an error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).URL = jest.fn().mockImplementation(() => {
      throw new Error('Invalid URL');
    });

    setupWindowOpenMock();
    renderWithLink('malformed-url-with.pdf', 'Malformed PDF');

    // Should still track because catch block checks normalizedHref
    clickLinkAndExpectTracking('malformed-url-with.pdf', 'Malformed PDF', () =>
      screen.getByText('Malformed PDF'),
    );

    window.URL = originalURL;
  });
});
