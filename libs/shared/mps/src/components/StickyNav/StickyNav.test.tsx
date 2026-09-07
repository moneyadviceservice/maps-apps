import '@testing-library/jest-dom';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { StickyNav } from './StickyNav';

let mockAsPath = '/en/learning-pathway';

jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: mockAsPath,
  }),
}));

jest.mock('@maps-react/hooks/useOnClickOutside', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@maps-react/common/components/Icon', () => ({
  Icon: ({ type, className }: { type: string; className?: string }) => (
    <svg className={className} data-testid={`icon-${type}`} />
  ),
  IconType: {
    CHEVRON_DOWN: 'chevron-down',
    CHEVRON_RIGHT: 'chevron-right',
    CLOSE: 'close',
  },
}));

jest.mock('focus-trap-react', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const navigation = {
  navigationTitle: 'Debt Quality',
  links: [
    { title: 'Training and Qualifications', link: '/training' },
    { title: 'Quality Standards and Codes', link: '/standards' },
    { title: 'Learning pathway', link: '/learning-pathway' },
    { title: 'Latest quality updates', link: '/updates' },
  ],
};

const setElementTop = (element: Element, top: number) => {
  jest
    .spyOn(element, 'getBoundingClientRect')
    .mockReturnValue({ top } as DOMRect);
};

const renderPage = () => {
  const result = render(
    <>
      <h2>First section</h2>
      <StickyNav
        lang="en"
        navigation={navigation}
        label="Explore this topic"
        closeLabel="Close"
      />
      <footer>Footer</footer>
    </>,
  );

  const heading = screen.getByRole('heading', { level: 2 });
  const footer = screen.getByRole('contentinfo');
  setElementTop(heading, 100);
  setElementTop(footer, window.innerHeight + 100);

  act(() => window.dispatchEvent(new Event('scroll')));

  return result;
};

const renderVisiblePage = () => {
  const result = renderPage();
  setElementTop(screen.getByRole('heading', { level: 2 }), 0);
  act(() => window.dispatchEvent(new Event('scroll')));

  return result;
};

describe('StickyNav', () => {
  beforeEach(() => {
    mockAsPath = '/en/learning-pathway';
  });

  it('renders collapsed by default showing the banner label', () => {
    renderPage();

    expect(screen.getByTestId('sticky-nav')).toBeInTheDocument();
    expect(screen.getByTestId('sticky-nav')).toHaveClass('hidden');
    expect(screen.getByTestId('sticky-nav')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveTextContent(
      'Explore this topic',
    );
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveAttribute(
      'id',
      'local-nav-toggle',
    );
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveAttribute(
      'aria-controls',
      'local-nav-panel',
    );
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveClass(
      'gap-[13px]',
      'rounded-t-[4px]',
      'focus-visible:bg-yellow-400',
      'focus-visible:text-gray-800',
      'focus-visible:ring-[3px]',
      'focus-visible:ring-inset',
      'focus-visible:ring-purple-500',
      'active:ring-[3px]',
      'active:ring-inset',
      'active:ring-yellow-400',
      'active:bg-magenta-500',
      'active:text-white',
    );
    expect(screen.getByTestId('icon-chevron-down')).toHaveClass('w-4', 'h-4');
    expect(screen.queryByTestId('sticky-nav-content')).not.toBeInTheDocument();
  });

  it('shows after the first H2 reaches the viewport top and hides at the footer', () => {
    renderPage();

    const stickyNav = screen.getByTestId('sticky-nav');
    const heading = screen.getByRole('heading', { level: 2 });
    const footer = screen.getByRole('contentinfo');

    setElementTop(heading, 0);
    act(() => window.dispatchEvent(new Event('scroll')));

    expect(stickyNav).not.toHaveClass('hidden');
    expect(stickyNav).toHaveAttribute('aria-hidden', 'false');

    setElementTop(footer, window.innerHeight);
    act(() => window.dispatchEvent(new Event('scroll')));

    expect(stickyNav).toHaveClass('hidden');
    expect(stickyNav).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses the explicit start boundary when the page has no H2', () => {
    render(
      <>
        <main data-sticky-nav-start>Main content</main>
        <StickyNav lang="en" navigation={navigation} />
        <footer>Footer</footer>
      </>,
    );

    const stickyNav = screen.getByTestId('sticky-nav');
    const startBoundary = screen.getByRole('main');
    const footer = screen.getByRole('contentinfo');
    setElementTop(startBoundary, 0);
    setElementTop(footer, window.innerHeight + 100);

    act(() => window.dispatchEvent(new Event('scroll')));

    expect(stickyNav).not.toHaveClass('hidden');
    expect(stickyNav).toHaveAttribute('aria-hidden', 'false');
  });

  it('renders nothing when there are no navigation links', () => {
    const { container } = render(
      <StickyNav lang="en" navigation={{ navigationTitle: '', links: [] }} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('expands to show the title, links and close control when toggled', () => {
    const { container } = renderVisiblePage();

    fireEvent.click(screen.getByTestId('sticky-nav-toggle'));

    expect(screen.getByTestId('sticky-nav-content')).toBeInTheDocument();
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByTestId('sticky-nav-toggle')).toHaveClass(
      'bg-magenta-500',
      'gap-[13px]',
      'rounded-t-[4px]',
      'pb-[11px]',
      'pt-[9px]',
      'focus-visible:bg-yellow-400',
      'focus-visible:text-gray-800',
      'focus-visible:ring-[3px]',
      'focus-visible:ring-inset',
      'focus-visible:ring-purple-500',
      'active:ring-[3px]',
      'active:ring-inset',
      'active:ring-yellow-400',
      'active:bg-magenta-500',
      'active:text-white',
    );
    expect(screen.getByRole('navigation')).toHaveAttribute(
      'id',
      'local-nav-panel',
    );
    expect(screen.getByText('Debt Quality')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    expect(screen.getByTestId('icon-close')).not.toHaveClass('text-white');

    expect(screen.queryByRole('link', { name: 'Learning pathway' })).toBeNull();
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent(
      'Learning pathway',
    );

    navigation.links
      .filter(({ title }) => title !== 'Learning pathway')
      .forEach(({ title, link }) => {
        const anchor = screen.getByRole('link', { name: title });
        expect(anchor).toHaveAttribute('href', `/en${link}`);
        expect(anchor).toHaveClass('hover:text-pink-900', 'hover:underline');
      });
    expect(screen.getAllByTestId('icon-chevron-right')).toHaveLength(
      navigation.links.length - 1,
    );
  });

  it('renders the current page as text rather than a link', () => {
    const { container } = renderVisiblePage();

    fireEvent.click(screen.getByTestId('sticky-nav-toggle'));

    expect(
      screen.queryByRole('link', { name: 'Learning pathway' }),
    ).not.toBeInTheDocument();
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent(
      'Learning pathway',
    );
  });

  it('collapses again when toggled a second time', () => {
    renderVisiblePage();

    fireEvent.click(screen.getByTestId('sticky-nav-toggle'));
    expect(screen.getByTestId('sticky-nav-content')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('sticky-nav-toggle'));
    expect(screen.queryByTestId('sticky-nav-content')).not.toBeInTheDocument();
  });
});
