import mockRouter from 'next-router-mock';

import { render, screen } from '@testing-library/react';

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

  const setupRouter = (query?: {
    order?: string;
    providerName?: string;
    p?: string;
  }) => {
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

  beforeEach(() => {
    setupRouter();
  });

  describe('Rendering', () => {
    it('renders only left dots when near the end (shouldShowLeftDots && !shouldShowRightDots)', () => {
      const { container, getByTestId } = renderPagination({
        page: 24,
        totalPages: 25,
        pageRange: 1,
        startIndex: 231,
        endIndex: 240,
        totalItems: 250,
      });

      // Only select links inside the desktop branch
      const desktopDiv = container.querySelector(String.raw`div.md\:flex`);
      const activeLink = getByTestId(`desktop-active-page-24`);
      expect(activeLink).toBeInTheDocument();
      const activeLinkText = activeLink.textContent;
      expect(activeLinkText).toBe('24');
      const pageLinks = [
        activeLinkText,
        ...Array.from(desktopDiv?.querySelectorAll('a') || []).map(
          (el) => el.textContent,
        ),
      ].sort((a, b) => (a > b ? 1 : -1));

      expect(pageLinks).toEqual(['1', '21', '22', '23', '24', '25']);

      // Should have exactly one set of dots in the desktop branch
      const dots = desktopDiv?.querySelectorAll('li.text-magenta-500');
      expect(dots?.length).toBe(1);
      expect(dots?.[0]).toHaveTextContent('…');
    });

    it('renders dots in the desktop pagination branch', () => {
      const { container } = renderPagination({
        page: 5,
        totalPages: 10,
        pageRange: 1,
        startIndex: 41,
        endIndex: 50,
        totalItems: 100,
      });

      // Select the desktop branch
      const desktopDiv = container.querySelector(String.raw`div.md\:flex`);
      // Find all dot elements in the desktop branch
      const dots = desktopDiv?.querySelectorAll('li.text-magenta-500');
      expect(dots?.length).toBeGreaterThan(0);
      dots?.forEach((dot) => {
        expect(dot).toHaveTextContent('…');
      });
    });

    it('renders all page numbers as links with no dots when totalPages <= 3 (mobile branch)', () => {
      const { container } = renderPagination({
        page: 2,
        totalPages: 3,
        startIndex: 1,
        endIndex: 10,
        totalItems: 30,
      });

      // Only select links inside <li> with md-hidden (mobile branch)
      const mobileLis = container.querySelectorAll(String.raw`li.md\:hidden`);
      const pageNumbers = Array.from(mobileLis).map((li) => li.textContent);
      expect(pageNumbers).toEqual(['1', '2', '3']);

      // There should be no dots (ellipsis) in the mobile branch
      expect(
        Array.from(mobileLis).some((li) =>
          li.classList.contains('text-magenta-500'),
        ),
      ).toBe(false);
    });
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
      const { getAllByText } = renderPagination();
      const activePages = getAllByText('3');
      const currentPage = activePages.find(
        (el) => el.getAttribute('aria-current') === 'page',
      );
      expect(currentPage).toHaveAttribute('aria-current', 'page');
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
      },
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
    it('applies active classes to the current page link', () => {
      const { getByTestId } = renderPagination({
        page: 2,
        totalPages: 5,
        startIndex: 1,
        endIndex: 10,
        totalItems: 50,
      });

      const activeLink = getByTestId(`desktop-active-page-2`);
      expect(activeLink).toBeInTheDocument();
      // Should have active styling classes
      expect(activeLink).toHaveClass('bg-magenta-500');
      expect(activeLink).toHaveClass('text-white');
      expect(activeLink).toHaveClass('border-magenta-500');
      expect(activeLink).toHaveClass('no-underline');
      expect(activeLink).toHaveClass('cursor-default');
      expect(activeLink).toHaveAttribute('aria-current', 'page');
    });

    it('applies inactive styling to non-current links', () => {
      renderPagination({
        page: 2,
        totalPages: 5,
        startIndex: 1,
        endIndex: 10,
        totalItems: 50,
      });

      const links = screen.getAllByRole('link');
      const inactiveLink = links.find(
        (l) => l.getAttribute('aria-current') !== 'page',
      );

      expect(inactiveLink).toBeTruthy();
      // Should have inactive styling classes
      expect(inactiveLink).toHaveClass('text-magenta-500');
      expect(inactiveLink).toHaveClass('border-white');
    });
  });
});
