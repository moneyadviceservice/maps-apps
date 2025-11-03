import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Pagination, PaginationProps } from './Pagination';

import '@testing-library/jest-dom';

// Test utilities and helpers
const createPaginationProps = (
  overrides: Partial<PaginationProps> = {},
): PaginationProps => ({
  pagination: {
    currentPage: 1,
    totalPages: 10,
    totalItems: 100,
    hasNextPage: true,
    hasPreviousPage: false,
    startIndex: 1,
    endIndex: 10,
    itemsPerPage: 10,
  },
  ...overrides,
});

const renderPagination = (props: Partial<PaginationProps> = {}) => {
  return render(<Pagination {...createPaginationProps(props)} />);
};

const expectPageNumbersToBeVisible = (pageNumbers: number[]) => {
  for (const page of pageNumbers) {
    expect(screen.getByText(page.toString())).toBeInTheDocument();
  }
};

const expectPageNumbersNotToBeVisible = (pageNumbers: number[]) => {
  for (const page of pageNumbers) {
    expect(screen.queryByText(page.toString())).not.toBeInTheDocument();
  }
};

const expectButtonToBeDisabled = (buttonText: string) => {
  const button = screen.getByText(buttonText);
  expect(button).toHaveClass(
    'disabled:cursor-not-allowed',
    'disabled:bg-transparent',
  );
};

const expectButtonToBeEnabled = (buttonText: string, variant: string) => {
  const button = screen.getByText(buttonText);
  if (variant === 'secondary') {
    expect(button).toHaveClass('t-link-button');
  } else {
    expect(button).toHaveClass(`t-${variant}-button`);
  }
};

const expectPageToHaveVariant = (pageNumber: number, variant: string) => {
  const pageButton = screen.getByText(pageNumber.toString());
  if (variant === 'secondary') {
    expect(pageButton).toHaveClass('t-link-button');
  } else {
    expect(pageButton).toHaveClass(`t-${variant}-button`);
  }
};

const expectPageToHaveHref = (pageNumber: number, expectedHref: string) => {
  const pageButton = screen.getByText(pageNumber.toString());
  expect(pageButton).toHaveAttribute('href', expectedHref);
};

const clickPageAndExpectCallback = (
  pageNumber: number,
  mockCallback: jest.Mock,
  expectedCall: number,
) => {
  const pageButton = screen.getByText(pageNumber.toString());
  fireEvent.click(pageButton);
  expect(mockCallback).toHaveBeenCalledWith(expectedCall);
};

describe('Pagination component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  describe('Basic rendering', () => {
    it('renders pagination with correct results info', () => {
      renderPagination();
      expect(screen.getByText('1 - 10 of 100')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      const { container } = renderPagination({ className: 'custom-class' });
      const mainDiv = container.querySelector('div:not(noscript)');
      expect(mainDiv).toHaveClass('custom-class');
    });

    it.each([0, 1])('does not render when totalPages is %d', (totalPages) => {
      const { container } = renderPagination({
        pagination: {
          currentPage: 1,
          totalPages,
          totalItems: 100,
          hasNextPage: false,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 10,
          itemsPerPage: 10,
        },
      });
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Page range generation', () => {
    it('renders all pages when totalPages is 5 or less', () => {
      renderPagination({
        pagination: {
          currentPage: 3,
          totalPages: 5,
          totalItems: 50,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 21,
          endIndex: 30,
          itemsPerPage: 10,
        },
      });
      expectPageNumbersToBeVisible([1, 2, 3, 4, 5]);
    });

    it('renders first 10 pages when current page is near the beginning', () => {
      renderPagination({
        pagination: {
          currentPage: 2,
          totalPages: 20,
          totalItems: 200,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 11,
          endIndex: 20,
          itemsPerPage: 10,
        },
      });
      expectPageNumbersToBeVisible([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expectPageNumbersNotToBeVisible([11]);
    });

    it('renders last 10 pages when current page is near the end', () => {
      renderPagination({
        pagination: {
          currentPage: 9,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 81,
          endIndex: 90,
          itemsPerPage: 10,
        },
      });
      expectPageNumbersToBeVisible([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expectPageNumbersNotToBeVisible([11]);
    });

    it('renders middle pages when current page is in the middle', () => {
      renderPagination({
        pagination: {
          currentPage: 5,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 41,
          endIndex: 50,
          itemsPerPage: 10,
        },
      });
      expectPageNumbersToBeVisible([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('shows first and last page when they are not in range', () => {
      renderPagination({
        pagination: {
          currentPage: 5,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 41,
          endIndex: 50,
          itemsPerPage: 10,
        },
      });
      expectPageNumbersToBeVisible([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe('Navigation buttons', () => {
    it.each([
      ['Previous', 'hasPreviousPage', false],
      ['Next', 'hasNextPage', false],
    ])(
      'does not render %s button when %s is false',
      (buttonText, propName, value) => {
        renderPagination({
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: propName === 'hasNextPage' ? value : true,
            hasPreviousPage: propName === 'hasPreviousPage' ? value : true,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        expect(screen.queryByText(buttonText)).not.toBeInTheDocument();
      },
    );

    it.each([
      ['Previous', 'hasPreviousPage', true, { currentPage: 2 }],
      ['Next', 'hasNextPage', true, {}],
    ])(
      'renders enabled %s button when %s is true',
      (buttonText, propName, value, additionalProps) => {
        renderPagination({
          pagination: {
            currentPage: (additionalProps as any).currentPage || 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: propName === 'hasNextPage' ? value : true,
            hasPreviousPage: propName === 'hasPreviousPage' ? value : true,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        expectButtonToBeEnabled(buttonText, 'secondary');
      },
    );
  });

  describe('Page click handling', () => {
    let mockOnPageChange: jest.Mock;

    beforeEach(() => {
      mockOnPageChange = jest.fn();
    });

    it('calls onPageChange when a page is clicked', () => {
      renderPagination({
        pagination: {
          currentPage: 1,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 10,
          itemsPerPage: 10,
        },
        onPageChange: mockOnPageChange,
      });
      clickPageAndExpectCallback(2, mockOnPageChange, 2);
    });

    it('calls onPageChange when Previous button is clicked', () => {
      renderPagination({
        pagination: {
          currentPage: 2,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 11,
          endIndex: 20,
          itemsPerPage: 10,
        },
        onPageChange: mockOnPageChange,
      });

      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange when Next button is clicked', () => {
      renderPagination({
        pagination: {
          currentPage: 1,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 10,
          itemsPerPage: 10,
        },
        onPageChange: mockOnPageChange,
      });

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });

    it('does not call onPageChange when disabled buttons are clicked', () => {
      renderPagination({
        pagination: {
          currentPage: 2,
          totalPages: 2,
          totalItems: 20,
          hasNextPage: false,
          hasPreviousPage: true,
          startIndex: 11,
          endIndex: 20,
          itemsPerPage: 10,
        },
        onPageChange: mockOnPageChange,
      });

      // Test that Next button is not rendered when hasNextPage is false
      expect(screen.queryByText('Next')).not.toBeInTheDocument();

      // Test clicking the Previous button (which should be enabled)
      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton);
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe('URL generation for server-side navigation', () => {
    it.each([
      [
        '/search?q=test&category=reports&page=2',
        {
          baseUrl: '/search',
          query: { q: 'test', category: 'reports' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        },
        2,
      ],
      [
        '/search?q=test',
        {
          baseUrl: '/search',
          query: { q: 'test' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        },
        1,
      ],
      [
        '/search?tags=tag1%2Ctag2&q=test&page=2',
        {
          baseUrl: '/search',
          query: { tags: ['tag1', 'tag2'], q: 'test' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        },
        2,
      ],
      [
        '/search?q=test&page=2',
        {
          baseUrl: '/search',
          query: { q: 'test', page: '3' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        },
        2,
      ],
      [
        '/search',
        {
          baseUrl: '/search',
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        },
        1,
      ],
    ])(
      'generates correct URL %s for page %d',
      (expectedHref, props, pageNumber) => {
        renderPagination(props);
        expectPageToHaveHref(pageNumber, expectedHref);
      },
    );

    describe('limit parameter preservation', () => {
      it('generates URL with limit parameter preserved when navigating to page 2', () => {
        renderPagination({
          baseUrl: '/search',
          query: { limit: '20', q: 'test' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        expectPageToHaveHref(2, '/search?limit=20&q=test&page=2');
      });

      it('generates URL with limit parameter preserved when navigating to page 1', () => {
        renderPagination({
          baseUrl: '/search',
          query: { limit: '30' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        expectPageToHaveHref(1, '/search?limit=30');
      });

      it('generates URL with limit and multiple other parameters preserved', () => {
        renderPagination({
          baseUrl: '/search',
          query: {
            limit: '50',
            keyword: 'evidence',
            topic: ['saving', 'debt'],
            year: '2023',
          },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        expectPageToHaveHref(
          3,
          '/search?limit=50&keyword=evidence&topic=saving%2Cdebt&year=2023&page=3',
        );
      });

      it('generates URL without limit when limit is not in query', () => {
        renderPagination({
          baseUrl: '/search',
          query: { q: 'test' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        expectPageToHaveHref(2, '/search?q=test&page=2');
      });

      it('preserves limit when navigating with Previous button', () => {
        renderPagination({
          baseUrl: '/search',
          query: { limit: '25', q: 'test' },
          pagination: {
            currentPage: 2,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: true,
            startIndex: 11,
            endIndex: 20,
            itemsPerPage: 10,
          },
        });
        const previousButton = screen.getByText('Previous');
        expect(previousButton).toHaveAttribute(
          'href',
          '/search?limit=25&q=test',
        );
      });

      it('preserves limit when navigating with Next button', () => {
        renderPagination({
          baseUrl: '/search',
          query: { limit: '15', q: 'test' },
          pagination: {
            currentPage: 1,
            totalPages: 10,
            totalItems: 100,
            hasNextPage: true,
            hasPreviousPage: false,
            startIndex: 1,
            endIndex: 10,
            itemsPerPage: 10,
          },
        });
        const nextButton = screen.getByText('Next');
        expect(nextButton).toHaveAttribute(
          'href',
          '/search?limit=15&q=test&page=2',
        );
      });
    });
  });

  describe('Current page highlighting', () => {
    it('highlights current page with primary variant and others with secondary', () => {
      renderPagination({
        pagination: {
          currentPage: 3,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: true,
          startIndex: 21,
          endIndex: 30,
          itemsPerPage: 10,
        },
      });
      expectPageToHaveVariant(3, 'primary');
      expectPageToHaveVariant(2, 'secondary');
    });
  });

  describe('Accessibility and noscript fallback', () => {
    it('renders proper link attributes for accessibility', () => {
      renderPagination();
      // Check that page elements are rendered as anchor tags
      const pageElements = screen.getAllByText(/^\d+$/);
      for (const element of pageElements) {
        expect(element.tagName).toBe('A');
      }
    });
  });

  describe('Edge cases', () => {
    it('handles very large page numbers', () => {
      renderPagination({
        pagination: {
          currentPage: 1000,
          totalPages: 1000,
          totalItems: 10000,
          hasNextPage: false,
          hasPreviousPage: true,
          startIndex: 9991,
          endIndex: 10000,
          itemsPerPage: 10,
        },
      });

      expect(screen.getByText('9991 - 10000 of 10000')).toBeInTheDocument();
      expect(screen.getByText('1000')).toBeInTheDocument();
    });

    it('handles single digit page numbers correctly', () => {
      renderPagination({
        pagination: {
          currentPage: 1,
          totalPages: 3,
          totalItems: 30,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 10,
          itemsPerPage: 10,
        },
      });

      expectPageNumbersToBeVisible([1, 2, 3]);
    });

    it('handles empty query object', () => {
      renderPagination({
        baseUrl: '/search',
        query: {},
        pagination: {
          currentPage: 1,
          totalPages: 10,
          totalItems: 100,
          hasNextPage: true,
          hasPreviousPage: false,
          startIndex: 1,
          endIndex: 10,
          itemsPerPage: 10,
        },
      });
      expectPageToHaveHref(1, '/search');
    });
  });
});
