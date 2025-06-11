import mockRouter from 'next-router-mock';

import { render } from '@testing-library/react';

import Pagination from './Pagination';

import '@testing-library/jest-dom';

jest.mock('next/router', () => require('next-router-mock'));

describe('Pagination component', () => {
  const renderPagination = (props = {}) => {
    return render(
      <Pagination
        page={3}
        totalPages={25}
        startIndex={20}
        endIndex={30}
        totalItems={242}
        {...props}
      />,
    );
  };

  beforeEach(() => {
    mockRouter.push({ query: { order: '', providerName: 'AZ', p: '2' } });
  });

  it('renders correctly', () => {
    const { container } = renderPagination();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders component when no results', () => {
    const { container } = renderPagination({
      page: 0,
      totalPages: 0,
      startIndex: 0,
      endIndex: 0,
      totalItems: 0,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

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

  it('renders correct translations for Previous and Next buttons', () => {
    const { getByText } = renderPagination();
    expect(getByText('Previous')).toBeInTheDocument();
    expect(getByText('Next')).toBeInTheDocument();
  });

  it.each([
    [0, 'renders correctly when pageRange is 0'],
    [20, 'renders correctly when pageRange is large'],
  ])('%s', (pageRange) => {
    const { container } = renderPagination({
      pageRange,
    });
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders left dots when necessary', () => {
    const { container } = renderPagination({
      page: 15,
      totalPages: 20,
      pageRange: 2,
      startIndex: 280,
      endIndex: 300,
      totalItems: 400,
    });

    const dotsElement = container.querySelector('li.text-pink-600');
    expect(dotsElement).toBeInTheDocument();
    expect(container).toHaveTextContent('1');
    expect(container).toHaveTextContent('20');
    expect(container).toHaveTextContent('13');
    expect(container).toHaveTextContent('14');
    expect(container).toHaveTextContent('15');
  });

  it('applies correct number classes to pagination elements', () => {
    const { container } = renderPagination();

    const pageLink = container.querySelector('li a');

    expect(pageLink).toHaveClass('flex');

    expect(pageLink).toHaveClass(
      'flex text-base items-center underline px-3.5 py-1 border-4 rounded-bl-lg hover:bg-gray-200',
    );
  });
  it('applies correct classes to the pagination links for numberClasses', () => {
    const { container } = renderPagination();

    const link = container.querySelector('li a');

    expect(link).toHaveClass(
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
      'focus:bg-yellow-200',
      'focus:border-blue-800',
      'focus:!text-gray-800',
      'focus:outline-0',
      'focus:shadow-none',
      'active:!bg-gray-200',
      'active:border-gray-200',
      'active:!text-gray-800',
      'active:outline-0',
      'active:underline',
    );
  });

  it('renders left dots when necessary and does not render right dots', () => {
    const { container } = renderPagination({
      page: 3,
      totalPages: 20,
      pageRange: 2,
      startIndex: 41,
      endIndex: 60,
      totalItems: 200,
    });

    const dotsElement = container.querySelector('li.text-pink-600');
    expect(dotsElement).toBeInTheDocument();
    expect(dotsElement).toHaveTextContent('…');

    expect(container).toHaveTextContent('1');
    expect(container).toHaveTextContent('20');

    expect(container).toHaveTextContent('3');
    expect(container).toHaveTextContent('4');
    expect(container).toHaveTextContent('5');

    const rightDots = container.querySelectorAll('li.text-pink-600');
    expect(rightDots.length).toBe(1);
  });

  it('renders left and right dots when necessary', () => {
    const { container } = renderPagination({
      page: 5,
      totalPages: 20,
      pageRange: 2,
      startIndex: 41,
      endIndex: 60,
      totalItems: 200,
    });

    const dotsElement = container.querySelector('li.text-pink-600');
    expect(dotsElement).toBeInTheDocument();
    expect(dotsElement).toHaveTextContent('…');

    expect(container).toHaveTextContent('1');
    expect(container).toHaveTextContent('20');

    expect(container).toHaveTextContent('4');
    expect(container).toHaveTextContent('5');
    expect(container).toHaveTextContent('6');

    const rightDots = container.querySelectorAll('li.text-pink-600');
    expect(rightDots.length).toBe(2);
  });

  it('renders right dots when necessary and does not render left dots', () => {
    const { container } = renderPagination({
      page: 3,
      totalPages: 20,
      pageRange: 2,
      startIndex: 41,
      endIndex: 60,
      totalItems: 200,
    });

    const dotsElement = container.querySelector('li.text-pink-600');
    expect(dotsElement).toBeInTheDocument();
    expect(dotsElement).toHaveTextContent('…');

    expect(container).toHaveTextContent('1');
    expect(container).toHaveTextContent('20');

    expect(container).toHaveTextContent('2');
    expect(container).toHaveTextContent('4');
    expect(container).toHaveTextContent('5');

    const rightDots = container.querySelectorAll('li.text-pink-600');
    expect(rightDots.length).toBe(1);
  });

  it('focuses the main content when a page link is clicked', () => {
    const focusMock = jest.fn();

    document.body.innerHTML = `
      <div id="main-content" tabindex="-1">Main Content</div>
    `;

    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus = focusMock;
    }

    const { getByText } = renderPagination({
      page: 3,
      totalPages: 25,
      startIndex: 20,
      endIndex: 30,
      totalItems: 242,
    });

    const page4Link = getByText('4');
    page4Link.click();

    expect(focusMock).toHaveBeenCalledTimes(1);
    expect(focusMock).toHaveBeenCalledWith();
  });
});
