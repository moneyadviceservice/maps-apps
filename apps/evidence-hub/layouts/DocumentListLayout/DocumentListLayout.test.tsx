import { DocumentTemplate } from 'types/@adobe/page';
import { render, screen } from '@testing-library/react';

import { DocumentListLayout } from './DocumentListLayout';

import '@testing-library/jest-dom';
import { Pagination } from 'utils/pagination/paginationUtils';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

const baseDoc: DocumentTemplate = {
  seoTitle: 'SEO Title',
  seoDescription: 'SEO description',
  title: 'Sample Doc',
  slug: 'sample-doc',
  breadcrumbs: [],
  publishDate: '2023-01-01T00:00:00Z',
  sections: [],
  contactInformation: { json: [] },
  clientGroup: [],
  topic: [],
  countryOfDelivery: [],
  links: [],
};

const pagination: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 1,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPreviousPage: false,
  startIndex: 1,
  endIndex: 10,
};

describe('DocumentListLayout', () => {
  const defaultProps = {
    documents: [baseDoc],
    lang: 'en',
    tags: [{ label: 'Category', tags: [], slug: '', key: '' }],
    query: {},
    pagination,
    onLimitChange: jest.fn(),
  };

  const renderDocumentListLayout = (props = {}) => {
    return render(<DocumentListLayout {...defaultProps} {...props} />);
  };

  const createPaginationWithMultiplePages = (overrides = {}) => ({
    ...pagination,
    totalPages: 3,
    totalItems: 25,
    hasNextPage: true,
    hasPreviousPage: true,
    ...overrides,
  });

  const expectDocumentCount = (count: number) => {
    expect(
      screen.getByText(
        new RegExp(`${count} document${count === 1 ? '' : 's'} found`, 'i'),
      ),
    ).toBeInTheDocument();
  };

  const expectPaginationElements = () => {
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  };

  const expectNoPaginationElements = () => {
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  };

  it('renders empty state when no documents', () => {
    renderDocumentListLayout({ documents: [] });

    expect(
      screen.getByText(
        /We're sorry, no results have been found for your search./i,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Back to top')).not.toBeInTheDocument();
  });

  it('renders list of documents when provided', () => {
    const { getByText } = renderDocumentListLayout();

    expectDocumentCount(1);
    expect(getByText('Sample Doc')).toBeInTheDocument();
  });

  it('always renders PaginationFilter when documents are present', () => {
    renderDocumentListLayout();

    expect(screen.getByText('View per page')).toBeInTheDocument();
    expect(screen.getByText('10 per page')).toBeInTheDocument();
  });

  it('renders Pagination component when pagination is provided', () => {
    renderDocumentListLayout({
      pagination: createPaginationWithMultiplePages(),
      onPageChange: jest.fn(),
      baseUrl: '/test',
    });

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === '1 - 10 of 25';
      }),
    ).toBeInTheDocument();
    expectPaginationElements();
  });

  it('does not render Pagination component when pagination is null', () => {
    renderDocumentListLayout({ pagination: null as any });

    expectNoPaginationElements();
  });

  it('renders BackToTop component when documents are present', () => {
    renderDocumentListLayout();

    expect(screen.getByText('Back to top')).toBeInTheDocument();
  });

  it('handles form submission correctly', () => {
    const mockLocation = { href: '' };
    Object.defineProperty(globalThis, 'location', {
      value: mockLocation,
      writable: true,
    });

    renderDocumentListLayout();

    const form = screen.getByTestId('document-list-form');
    expect(form).toHaveAttribute('method', 'GET');
    expect(form).toHaveAttribute('action', '/en/evidence-library');
  });

  it('displays correct document count with pagination', () => {
    renderDocumentListLayout({
      pagination: createPaginationWithMultiplePages({ totalItems: 25 }),
    });

    expectDocumentCount(25);
  });

  it('displays correct document count without pagination', () => {
    renderDocumentListLayout({
      documents: [baseDoc, { ...baseDoc, title: 'Second Doc' }],
      pagination: null as any,
    });

    expectDocumentCount(2);
  });

  describe('handleSubmit function', () => {
    let mockLocation: { href: string };
    let originalFormData: typeof FormData;

    beforeEach(() => {
      mockLocation = { href: '' };
      Object.defineProperty(globalThis, 'location', {
        value: mockLocation,
        writable: true,
      });

      // Store original FormData
      originalFormData = globalThis.FormData;
    });

    afterEach(() => {
      // Restore original FormData after each test
      globalThis.FormData = originalFormData;
    });

    const createMockFormData = (entries: Array<[string, any]>) => ({
      entries: jest.fn().mockReturnValue(entries),
    });

    const submitForm = (form: HTMLElement) => {
      form.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      );
    };

    const testFormSubmission = (
      formDataEntries: Array<[string, any]>,
      expectedUrl: string,
      props = {},
    ) => {
      renderDocumentListLayout(props);
      const form = screen.getByTestId('document-list-form');
      const mockFormData = createMockFormData(formDataEntries);
      globalThis.FormData = jest.fn().mockImplementation(() => mockFormData);
      submitForm(form);
      expect(mockLocation.href).toBe(expectedUrl);
    };

    const testFormSubmissionCases: Array<{
      name: string;
      formData: Array<[string, any]>;
      expectedUrl: string;
      props?: any;
    }> = [
      {
        name: 'handles form submission with basic form data',
        formData: [
          ['category', 'pensions'],
          ['topic', 'retirement'],
        ],
        expectedUrl: '/en/evidence-library?category=pensions&topic=retirement',
      },
      {
        name: 'filters out empty and whitespace-only values',
        formData: [
          ['category', 'pensions'],
          ['topic', ''], // empty
          ['clientGroup', '   '], // whitespace only
          ['country', 'england'],
        ],
        expectedUrl: '/en/evidence-library?category=pensions&country=england',
      },
      {
        name: 'removes duplicate values and joins with commas',
        formData: [
          ['category', 'pensions'],
          ['category', 'pensions'], // duplicate
          ['category', 'savings'],
          ['topic', 'retirement'],
          ['topic', 'retirement'], // duplicate
        ],
        expectedUrl:
          '/en/evidence-library?category=pensions%2Csavings&topic=retirement',
      },
      {
        name: 'handles multiple form fields correctly',
        formData: [
          ['category', 'pensions'],
          ['topic', 'retirement'],
          ['clientGroup', 'individuals'],
          ['countryOfDelivery', 'england'],
          ['countryOfDelivery', 'scotland'],
        ],
        expectedUrl:
          '/en/evidence-library?category=pensions&topic=retirement&clientGroup=individuals&countryOfDelivery=england%2Cscotland',
      },
      {
        name: 'filters out non-string values',
        formData: [
          ['category', 'pensions'],
          ['topic', 'retirement'],
          ['invalid', 123], // non-string
          ['another', null], // non-string
          ['valid', 'test'],
        ],
        expectedUrl:
          '/en/evidence-library?category=pensions&topic=retirement&valid=test',
      },
      {
        name: 'constructs URL with correct language prefix',
        formData: [['category', 'pensions']],
        expectedUrl: '/cy/evidence-library?category=pensions',
        props: { lang: 'cy' },
      },
      {
        name: 'handles form submission with no valid form data',
        formData: [
          ['category', ''],
          ['topic', '   '],
        ],
        expectedUrl: '/en/evidence-library?',
      },
      {
        name: 'trims whitespace from form values',
        formData: [
          ['category', '  pensions  '],
          ['topic', ' retirement '],
        ],
        expectedUrl: '/en/evidence-library?category=pensions&topic=retirement',
      },
      {
        name: 'handles keyword field correctly with single value',
        formData: [['keyword', 'test search']],
        expectedUrl: '/en/evidence-library?keyword=test+search',
      },
      {
        name: 'handles keyword field correctly when appearing multiple times',
        formData: [
          ['keyword', '360 degree'],
          ['keyword', '360 degree'], // duplicate entry (mobile + desktop)
        ],
        expectedUrl: '/en/evidence-library?keyword=360+degree',
      },
      {
        name: 'handles year field correctly with single value',
        formData: [['year', '2023']],
        expectedUrl: '/en/evidence-library?year=2023',
      },
      {
        name: 'handles year field correctly when appearing multiple times',
        formData: [
          ['year', '2023'],
          ['year', '2023'], // duplicate entry (mobile + desktop)
        ],
        expectedUrl: '/en/evidence-library?year=2023',
      },
      {
        name: 'handles keyword and other filters together',
        formData: [
          ['keyword', 'test search'],
          ['topic', 'pensions'],
          ['topic', 'retirement'],
        ],
        expectedUrl:
          '/en/evidence-library?keyword=test+search&topic=pensions%2Cretirement',
      },
      {
        name: 'handles keyword field correctly when user enters new value over old value',
        formData: [
          ['keyword', 'old search'], // old value from URL
          ['keyword', 'new search'], // new value user typed
        ],
        expectedUrl: '/en/evidence-library?keyword=new+search',
      },
      {
        name: 'handles year field correctly when user enters new value over old value',
        formData: [
          ['year', '2022'], // old value from URL
          ['year', '2023'], // new value user selected
        ],
        expectedUrl: '/en/evidence-library?year=2023',
      },
    ];

    for (const {
      name,
      formData,
      expectedUrl,
      props = {},
    } of testFormSubmissionCases) {
      it(name, () => {
        testFormSubmission(formData, expectedUrl, props);
      });
    }
  });
});
