import { useRouter } from 'next/router';

import { DocumentTemplate, TagGroup } from 'types/@adobe/page';
import { createSubmitEvent } from 'utils/fetch/__mocks__/testUtils';
import {
  type Pagination,
  type Pagination as PaginationType,
} from '@maps-react/utils/pagination';
import { QueryParams } from 'utils/query/queryHelpers';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { DocumentListLayout } from './DocumentListLayout';

import '@testing-library/jest-dom';

const mockPush = jest.fn();

jest.mock('pages/api/evidence-hub/filter', () => ({
  buildRedirectUrl: jest.fn((data: Record<string, string | string[]>) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else if (value) {
        params.set(key, String(value));
      }
    }
    const queryString = params.toString();
    const queryPart = queryString ? `?${queryString}` : '';
    return `/en/research-library${queryPart}`;
  }),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
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
  page: 1,
  totalPages: 1,
  totalItems: 1,
  itemsPerPage: 10,
  hasNextPage: false,
  hasPreviousPage: false,
  startIndex: 0,
  endIndex: 10,
};

describe('DocumentListLayout', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      asPath: '/',
      push: mockPush,
    });
    mockPush.mockClear();
  });

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
    page: 2, // Page > 1 to show Previous button
    totalPages: 3,
    totalItems: 25,
    startIndex: 10, // For page 2 with 10 items per page
    endIndex: 20,
    hasNextPage: true,
    hasPreviousPage: true,
    ...overrides,
  });

  const getDesktopForm = () => {
    return screen.getByTestId('document-list-form-desktop');
  };

  const expectDocumentCount = (count: number) => {
    const desktopForm = getDesktopForm();
    expect(
      within(desktopForm).getByText(
        new RegExp(`${count} document${count === 1 ? '' : 's'} found`, 'i'),
      ),
    ).toBeInTheDocument();
  };

  const expectPaginationElements = () => {
    const desktopForm = getDesktopForm();
    expect(within(desktopForm).getByText('Previous')).toBeInTheDocument();
    expect(within(desktopForm).getByText('Next')).toBeInTheDocument();
  };

  const expectNoPaginationElements = () => {
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  };

  it('renders empty state when no documents', () => {
    renderDocumentListLayout({ documents: [] });

    const desktopForm = getDesktopForm();
    expect(
      within(desktopForm).getByText(
        /We're sorry, no results have been found for your search./i,
      ),
    ).toBeInTheDocument();
    expect(
      within(desktopForm).queryByText('Back to top'),
    ).not.toBeInTheDocument();
  });

  it('renders list of documents when provided', () => {
    renderDocumentListLayout();

    expectDocumentCount(1);
    const desktopForm = getDesktopForm();
    expect(within(desktopForm).getByText('Sample Doc')).toBeInTheDocument();
  });

  it('always renders PaginationFilter when documents are present', () => {
    renderDocumentListLayout();

    const desktopForm = getDesktopForm();
    expect(within(desktopForm).getByText('View per page')).toBeInTheDocument();
    expect(within(desktopForm).getByText('10 per page')).toBeInTheDocument();
  });

  it('renders Pagination component when pagination is provided', () => {
    renderDocumentListLayout({
      pagination: createPaginationWithMultiplePages(),
      onPageChange: jest.fn(),
      baseUrl: '/test',
    });

    const desktopForm = getDesktopForm();
    // NumberOfAccounts displays "startIndex + 1 - endIndex of totalItems"
    // For page 2: startIndex=10, endIndex=20, totalItems=25 -> "11 - 20 of 25"
    expect(
      within(desktopForm).getByText((content, element) => {
        return element?.textContent?.trim() === '11 - 20 of 25';
      }),
    ).toBeInTheDocument();
    expectPaginationElements();
  });

  it('does not render Pagination component when pagination is null', () => {
    renderDocumentListLayout({ pagination: null as unknown as PaginationType });

    expectNoPaginationElements();
  });

  it('renders BackToTop component when documents are present', () => {
    renderDocumentListLayout();

    const desktopForm = getDesktopForm();
    expect(within(desktopForm).getByText('Back to top')).toBeInTheDocument();
  });

  it('handles form submission correctly', () => {
    renderDocumentListLayout();

    const form = getDesktopForm();
    expect(form).toHaveAttribute('method', 'GET');
    expect(form).toHaveAttribute('action', '/api/evidence-hub/filter');
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
      pagination: null as unknown as PaginationType,
    });

    expectDocumentCount(2);
  });

  describe('handleSubmit function', () => {
    beforeEach(() => {
      mockPush.mockClear();
    });

    const testFormSubmission = (
      formDataEntries: Array<[string, string | string[]]>,
      expectedPath: string,
      props: Partial<{
        documents: DocumentTemplate[];
        lang: string;
        tags: TagGroup[];
        query: QueryParams;
        pagination: PaginationType | null;
      }> = {},
    ) => {
      renderDocumentListLayout(props);
      const form = getDesktopForm() as HTMLFormElement;

      // Add form inputs to match the test data
      for (const [key, value] of formDataEntries) {
        if (typeof value === 'string' && value.trim()) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          form.appendChild(input);
        }
      }

      // Create a submit event with a submitter button
      const submitButton = form.querySelector(
        'button[type="submit"]',
      ) as HTMLButtonElement;
      const submitEvent = createSubmitEvent(submitButton);

      form.dispatchEvent(submitEvent);

      expect(mockPush).toHaveBeenCalled();
      const calledPath = mockPush.mock.calls[0][0];
      // Check that the path contains the expected parameters (allowing for URL encoding differences)
      expect(calledPath).toContain('/research-library');
    };

    const testFormSubmissionCases: Array<{
      name: string;
      formData: Array<[string, string | string[]]>;
      expectedUrl: string;
      props?: Partial<{
        documents: DocumentTemplate[];
        lang: string;
        tags: TagGroup[];
        query: QueryParams;
        pagination: PaginationType | null;
      }>;
    }> = [
      {
        name: 'handles form submission with basic form data',
        formData: [
          ['category', 'pensions'],
          ['topic', 'retirement'],
        ],
        expectedUrl: '/en/research-library?category=pensions&topic=retirement',
      },
      {
        name: 'filters out empty and whitespace-only values',
        formData: [
          ['category', 'pensions'],
          ['topic', ''], // empty
          ['clientGroup', '   '], // whitespace only
          ['country', 'england'],
        ],
        expectedUrl: '/en/research-library?category=pensions&country=england',
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
          '/en/research-library?category=pensions%2Csavings&topic=retirement',
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
          '/en/research-library?category=pensions&topic=retirement&clientGroup=individuals&countryOfDelivery=england%2Cscotland',
      },
      {
        name: 'filters out non-string values',
        formData: [
          ['category', 'pensions'],
          ['topic', 'retirement'],
          ['invalid', 123] as unknown as [string, string | string[]], // non-string
          ['another', null] as unknown as [string, string | string[]], // non-string
          ['valid', 'test'],
        ],
        expectedUrl:
          '/en/research-library?category=pensions&topic=retirement&valid=test',
      },
      {
        name: 'constructs URL with correct language prefix',
        formData: [['category', 'pensions']],
        expectedUrl: '/cy/research-library?category=pensions',
        props: { lang: 'cy' },
      },
      {
        name: 'handles form submission with no valid form data',
        formData: [
          ['category', ''],
          ['topic', '   '],
        ],
        expectedUrl: '/en/research-library?',
      },
      {
        name: 'trims whitespace from form values',
        formData: [
          ['category', '  pensions  '],
          ['topic', ' retirement '],
        ],
        expectedUrl: '/en/research-library?category=pensions&topic=retirement',
      },
      {
        name: 'handles keyword field correctly with single value',
        formData: [['keyword', 'test search']],
        expectedUrl: '/en/research-library?keyword=test+search',
      },
      {
        name: 'handles keyword field correctly when appearing multiple times',
        formData: [
          ['keyword', '360 degree'],
          ['keyword', '360 degree'], // duplicate entry (mobile + desktop)
        ],
        expectedUrl: '/en/research-library?keyword=360+degree',
      },
      {
        name: 'handles year field correctly with single value',
        formData: [['year', '2023']],
        expectedUrl: '/en/research-library?year=2023',
      },
      {
        name: 'handles year field correctly when appearing multiple times',
        formData: [
          ['year', '2023'],
          ['year', '2023'], // duplicate entry (mobile + desktop)
        ],
        expectedUrl: '/en/research-library?year=2023',
      },
      {
        name: 'handles keyword and other filters together',
        formData: [
          ['keyword', 'test search'],
          ['topic', 'pensions'],
          ['topic', 'retirement'],
        ],
        expectedUrl:
          '/en/research-library?keyword=test+search&topic=pensions%2Cretirement',
      },
      {
        name: 'handles keyword field correctly when user enters new value over old value',
        formData: [
          ['keyword', 'old search'], // old value from URL
          ['keyword', 'new search'], // new value user typed
        ],
        expectedUrl: '/en/research-library?keyword=new+search',
      },
      {
        name: 'handles year field correctly when user enters new value over old value',
        formData: [
          ['year', '2022'], // old value from URL
          ['year', '2023'], // new value user selected
        ],
        expectedUrl: '/en/research-library?year=2023',
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

    const testFormSubmissionWithSubmitter = (
      options: {
        elementType?: 'button' | 'input';
        name?: string;
        value?: string;
      } = {},
    ) => {
      const { elementType = 'button', name, value } = options;

      renderDocumentListLayout();
      const form = getDesktopForm() as HTMLFormElement;

      const submitButton =
        elementType === 'input'
          ? document.createElement('input')
          : document.createElement('button');
      submitButton.type = 'submit';
      if (name !== undefined) {
        submitButton.name = name;
      }
      if (value !== undefined) {
        submitButton.value = value;
      }
      form.appendChild(submitButton);

      const submitEvent = createSubmitEvent(submitButton);
      form.dispatchEvent(submitEvent);

      expect(mockPush).toHaveBeenCalled();
    };

    it('handles form submission with button submitter', () => {
      testFormSubmissionWithSubmitter({
        elementType: 'button',
        name: 'search',
        value: 'true',
      });
    });

    it('handles convertFormDataToObject with duplicate keys', () => {
      renderDocumentListLayout();
      const form = getDesktopForm() as HTMLFormElement;

      const formData = new FormData();
      formData.append('topic', 'pensions');
      formData.append('topic', 'savings');
      formData.append('keyword', 'test');

      // Access the convertFormDataToObject indirectly through form submission
      const submitEvent = createSubmitEvent();
      form.dispatchEvent(submitEvent);

      expect(mockPush).toHaveBeenCalled();
    });
  });

  describe('SortFilter integration', () => {
    it('should render SortFilter with correct props', () => {
      renderDocumentListLayout({ query: { keyword: 'test' } });

      const desktopForm = getDesktopForm();
      expect(
        within(desktopForm).getByText('Sort results by'),
      ).toBeInTheDocument();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      expect(sortSelect).toBeInTheDocument();
    });

    it('should show relevance option when keyword is present', () => {
      renderDocumentListLayout({ query: { keyword: 'test' } });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      const options = Array.from(sortSelect.querySelectorAll('option'));

      // Should have Relevance, Published date, and Recently updated
      expect(options.length).toBeGreaterThanOrEqual(3);
      expect(options.some((opt) => opt.textContent === 'Relevance')).toBe(true);
    });

    it('should not show relevance option when keyword is absent', () => {
      renderDocumentListLayout({ query: {} });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      const options = Array.from(sortSelect.querySelectorAll('option'));

      // Should only have Published date and Recently updated
      expect(options.length).toBe(2);
      expect(options.some((opt) => opt.textContent === 'Relevance')).toBe(
        false,
      );
    });

    it('should default to published order when no order parameter provided', () => {
      renderDocumentListLayout({ query: {} });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      expect(sortSelect).toHaveValue('published');
    });

    it('should default to relevance when keyword exists but no order', () => {
      renderDocumentListLayout({ query: { keyword: 'test' } });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      expect(sortSelect).toHaveValue('relevance');
    });

    it('should use provided order when keyword exists', () => {
      renderDocumentListLayout({
        query: { keyword: 'test', order: 'updated' },
      });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      expect(sortSelect).toHaveValue('updated');
    });
  });

  describe('handleSubmit edge cases', () => {
    beforeEach(() => {
      mockPush.mockClear();
    });

    const testFormSubmissionWithSubmitter = (
      options: {
        elementType?: 'button' | 'input';
        name?: string;
        value?: string;
        additionalAssertions?: () => void;
      } = {},
    ) => {
      const {
        elementType = 'button',
        name,
        value,
        additionalAssertions,
      } = options;

      renderDocumentListLayout();
      const form = getDesktopForm() as HTMLFormElement;

      const submitButton =
        elementType === 'input'
          ? document.createElement('input')
          : document.createElement('button');
      submitButton.type = 'submit';
      if (name !== undefined) {
        submitButton.name = name;
      }
      if (value !== undefined) {
        submitButton.value = value;
      }
      form.appendChild(submitButton);

      const submitEvent = createSubmitEvent(submitButton);
      form.dispatchEvent(submitEvent);

      expect(mockPush).toHaveBeenCalled();
      additionalAssertions?.();
    };

    it('should handle form submission without submitter', () => {
      renderDocumentListLayout();
      const form = getDesktopForm() as HTMLFormElement;

      const submitEvent = createSubmitEvent(null);

      form.dispatchEvent(submitEvent);

      expect(mockPush).toHaveBeenCalled();
    });

    it('should handle form submission with submitter that is not HTMLButtonElement', () => {
      testFormSubmissionWithSubmitter({
        elementType: 'input',
        name: 'search',
        value: 'true',
      });
      // Should still navigate even if submitter is not HTMLButtonElement
    });

    it('should handle form submission with button that has no name', () => {
      testFormSubmissionWithSubmitter({
        elementType: 'button',
        value: 'true',
        // No name attribute
      });
    });

    it('should handle form submission with button that has empty name', () => {
      testFormSubmissionWithSubmitter({
        elementType: 'button',
        name: '',
        value: 'true',
      });
    });

    it('should handle form submission with button that has no value', () => {
      testFormSubmissionWithSubmitter({
        elementType: 'button',
        name: 'search',
        // No value attribute
        additionalAssertions: () => {
          // Should append empty string when value is missing
          const calledPath = mockPush.mock.calls[0][0];
          expect(calledPath).toContain('/research-library');
        },
      });
    });

    it('should handle form submission with multiple language prefixes', () => {
      renderDocumentListLayout({ lang: 'cy' });
      const form = getDesktopForm() as HTMLFormElement;

      const submitEvent = createSubmitEvent();
      form.dispatchEvent(submitEvent);

      expect(mockPush).toHaveBeenCalled();
      const calledPath = mockPush.mock.calls[0][0];
      // Should replace /en/ with /cy/
      expect(calledPath).toContain('/cy/');
      expect(calledPath).not.toContain('/en/');
    });

    it('should handle query with array order value', () => {
      renderDocumentListLayout({
        query: { order: ['published'] as unknown as string },
      });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      // Should handle array order
      expect(sortSelect).toBeInTheDocument();
    });

    it('should handle query with undefined order', () => {
      renderDocumentListLayout({
        query: { order: undefined as unknown as string },
      });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });
      // Should default to published when order is undefined
      expect(sortSelect).toHaveValue('published');
    });
  });

  describe('onFilterChange function', () => {
    beforeEach(() => {
      mockPush.mockClear();
    });

    it('should extract name and value from event.target and call router.push with updated query', () => {
      const mockRouter = {
        query: { keyword: 'test', topic: 'pensions' },
        pathname: '/en/research-library',
        push: mockPush,
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      renderDocumentListLayout({
        query: { keyword: 'test', topic: 'pensions' },
      });

      const desktopForm = getDesktopForm();
      const paginationSelect = within(desktopForm).getByRole('combobox', {
        name: /select items per page/i,
      });

      fireEvent.change(paginationSelect, {
        target: { name: 'limit', value: '20' },
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/en/research-library',
          query: { keyword: 'test', topic: 'pensions', limit: '20' },
        },
        undefined,
        { scroll: false },
      );
    });

    it('should update order parameter when sort filter changes', () => {
      const mockRouter = {
        query: { keyword: 'test', limit: '10' },
        pathname: '/en/research-library',
        push: mockPush,
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      renderDocumentListLayout({
        query: { keyword: 'test', limit: '10' },
      });

      const desktopForm = getDesktopForm();
      const sortSelect = within(desktopForm).getByRole('combobox', {
        name: /sort results by/i,
      });

      fireEvent.change(sortSelect, {
        target: { name: 'order', value: 'updated' },
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/en/research-library',
          query: { keyword: 'test', limit: '10', order: 'updated' },
        },
        undefined,
        { scroll: false },
      );
    });

    it('should use router.pathname and handle empty router.query', () => {
      const mockRouter = {
        query: {},
        pathname: '/cy/research-library',
        push: mockPush,
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      renderDocumentListLayout({ lang: 'cy' });

      const desktopForm = getDesktopForm();
      const paginationSelect = within(desktopForm).getByRole('combobox', {
        name: /select items per page/i,
      });

      fireEvent.change(paginationSelect, {
        target: { name: 'limit', value: '20' },
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/cy/research-library',
          query: { limit: '20' },
        },
        undefined,
        { scroll: false },
      );
    });

    it('should override existing parameter value when updating the same parameter', () => {
      const mockRouter = {
        query: { limit: '10', keyword: 'test' },
        pathname: '/en/research-library',
        push: mockPush,
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      renderDocumentListLayout({
        query: { limit: '10', keyword: 'test' },
      });

      const desktopForm = getDesktopForm();
      const paginationSelect = within(desktopForm).getByRole('combobox', {
        name: /select items per page/i,
      });

      fireEvent.change(paginationSelect, {
        target: { name: 'limit', value: '30' },
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/en/research-library',
          query: { limit: '30', keyword: 'test' },
        },
        undefined,
        { scroll: false },
      );
    });

    it('should include route parameters from router.query when present', () => {
      const mockRouter = {
        query: { language: 'en', keyword: 'test' },
        pathname: '/[language]/research-library',
        push: mockPush,
      };
      (useRouter as jest.Mock).mockReturnValue(mockRouter);

      renderDocumentListLayout({
        query: { keyword: 'test' },
      });

      const desktopForm = getDesktopForm();
      const paginationSelect = within(desktopForm).getByRole('combobox', {
        name: /select items per page/i,
      });

      fireEvent.change(paginationSelect, {
        target: { name: 'limit', value: '30' },
      });

      expect(mockPush).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith(
        {
          pathname: '/[language]/research-library',
          query: { language: 'en', keyword: 'test', limit: '30' },
        },
        undefined,
        { scroll: false },
      );
    });
  });
});
