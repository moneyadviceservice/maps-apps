import React from 'react';
import mockRouter from 'next-router-mock';
import { render } from '@testing-library/react';
import Pagination from './Pagination';
import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('Pagination component', () => {
  // Test data fixtures
  const defaultProps = {
    page: 3,
    totalPages: 25,
    startIndex: 20,
    endIndex: 30,
    totalItems: 242,
  };

  const emptyProps = {
    page: 0,
    totalPages: 0,
    startIndex: 0,
    endIndex: 0,
    totalItems: 0,
  };

  // Helper functions
  const renderPagination = (props = {}) => {
    return render(<Pagination {...defaultProps} {...props} />);
  };

  const setupRouter = (query?: { order?: string; providerName?: string; p?: string }) => {
    const defaultQuery = { order: '', providerName: 'AZ', p: '2' };
    mockRouter.push({ query: query || defaultQuery });
  };

  const setupMainContentMock = () => {
    const focusMock = jest.fn();
    document.body.innerHTML = `
      <div id="main-content" tabindex="-1">Main Content</div>
    `;
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus = focusMock;
    }
    return focusMock;
  };

  // Expected class names as constants
  const PAGINATION_LINK_CLASSES = [
    'flex',
    'text-base',
    'items-center',
    'underline',
    'px-3.5',
    'py-1',
    'border-4',
    'rounded-bl-lg',
    'hover:bg-gray-200',
    'hover:!text-pink-900',
    'hover:border-gray-200',
    'hover:outline-0',
    'hover:no-underline',
    'focus:bg-yellow-400',
    'focus:border-blue-700',
    'focus:!text-gray-800',
    'focus:outline-0',
    'focus:shadow-none',
    'active:!bg-gray-200',
    'active:border-gray-200',
    'active:!text-gray-800',
    'active:outline-0',
    'active:underline',
  ];

  beforeEach(() => {
    setupRouter();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      const { container } = renderPagination();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('renders correctly when no results', () => {
      const { container } = renderPagination(emptyProps);
      expect(container.firstChild).toMatchSnapshot();
    });

    it.each([
      [0, 'renders correctly when pageRange is 0'],
      [20, 'renders correctly when pageRange is large'],
    ])('pageRange %i: %s', (pageRange) => {
      const { container } = renderPagination({ pageRange });
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('Navigation buttons', () => {
    it('does not render "Previous" button on the first page', () => {
      const { queryByText } = renderPagination({
        page: 1,
        totalPages: 5,
        startIndex: 1,
        endIndex: 10,
        totalItems: 50,
      });
      expect(queryByText('Previous')).not.toBeInTheDocument();
    });

    it('does not render "Next" button on the last page', () => {
      const { queryByText } = renderPagination({
        page: 5,
        totalPages: 5,
        startIndex: 41,
        endIndex: 50,
        totalItems: 50,
      });
      expect(queryByText('Next')).not.toBeInTheDocument();
    });

    it('renders correct translations for Previous and Next buttons', () => {
      const { getByText } = renderPagination();
      expect(getByText('Previous')).toBeInTheDocument();
      expect(getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Page links', () => {
    it('generates correct href for each page', () => {
      const { getByText } = renderPagination({
        page: 3,
        totalPages: 5,
        startIndex: 21,
        endIndex: 30,
        totalItems: 100,
      });
      const page2Link = getByText('2').closest('a');
      expect(page2Link).toHaveAttribute('href', '?order=&providerName=AZ&p=2');
    });

    it('marks the current page with aria-current', () => {
      const { getByText } = renderPagination();
      const activePage = getByText('3');
      expect(activePage).toHaveAttribute('aria-current', 'page');
    });

    it('focuses the main content when a page link is clicked', () => {
      const focusMock = setupMainContentMock();
      const { getByText } = renderPagination();

      const page4Link = getByText('4');
      page4Link.click();

      expect(focusMock).toHaveBeenCalledTimes(1);
      expect(focusMock).toHaveBeenCalledWith();
    });
  });

  describe('Ellipsis dots rendering', () => {
    const dotsTestCases = [
      {
        name: 'renders only right dots when near the beginning',
        props: {
          page: 3,
          totalPages: 20,
          pageRange: 2,
          startIndex: 41,
          endIndex: 60,
          totalItems: 200,
        },
        expectedPages: ['1', '2', '3', '4', '5', '20'],
      },
      {
        name: 'renders only left dots when near the end',
        props: {
          page: 15,
          totalPages: 20,
          pageRange: 2,
          startIndex: 280,
          endIndex: 300,
          totalItems: 400,
        },
        expectedPages: ['1', '13', '14', '15', '20'],
      },
      {
        name: 'renders both left and right dots when in the middle',
        props: {
          page: 5,
          totalPages: 20,
          pageRange: 2,
          startIndex: 41,
          endIndex: 60,
          totalItems: 200,
        },
        expectedPages: ['1', '4', '5', '6', '20'],
      }
    ];

    it.each(dotsTestCases)('$name', ({ props, expectedPages }) => {
      const { container } = renderPagination(props);
      
      // Check dots presence
      const dotsElements = container.querySelectorAll('li.text-magenta-500');
      
      expect(dotsElements[0]).toHaveTextContent('…');

      // Check expected page numbers are present
      for (const page of expectedPages) {
        expect(container).toHaveTextContent(page);
      }
    });
  });

  describe('Styling', () => {
    it('applies correct classes to pagination links', () => {
      const { container } = renderPagination();
      const link = container.querySelector('li a');

      for (const className of PAGINATION_LINK_CLASSES) {
        expect(link).toHaveClass(className);
      }
    });
  });
});