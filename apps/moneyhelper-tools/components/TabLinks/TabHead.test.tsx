import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TabHead } from './TabHead';

interface SvgProps extends React.SVGProps<SVGSVGElement> {}

jest.mock('assets/images/chevron.svg', () => {
  const ChevronSvg = (props: SvgProps) => <svg {...props} />;
  ChevronSvg.displayName = 'ChevronSvg';
  return ChevronSvg;
});

describe('TabHead', () => {
  const children = <div>Test Tabs</div>;

  const renderComponent = () => render(<TabHead>{children}</TabHead>);

  beforeEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(HTMLElement.prototype, 'scrollLeft', {
      configurable: true,
      value: 0,
      writable: true,
    });

    HTMLElement.prototype.scrollBy = jest.fn();
  });

  it('renders children correctly', () => {
    renderComponent();
    expect(screen.getByText('Test Tabs')).toBeInTheDocument();
  });

  it('shows right scroll button when content overflows', () => {
    renderComponent();
    expect(screen.getByTestId('button:right-arrow')).toBeInTheDocument();
    expect(screen.queryByTestId('button:left-arrow')).toBeInTheDocument();
  });

  it('shows left scroll button after scrolling right', () => {
    renderComponent();
    const nav = screen.getByTestId('nav-tab-list');
    fireEvent.scroll(nav, { target: { scrollLeft: 1000 } });
    expect(screen.getByTestId('button:left-arrow')).toBeInTheDocument();
  });

  it('scrolls right when right button is clicked', () => {
    renderComponent();
    const rightButton = screen.getByTestId('button:right-arrow');
    fireEvent.click(rightButton);
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith({
      left: 200,
      behavior: 'smooth',
    });
  });

  it('scrolls left when left button is clicked', () => {
    renderComponent();
    const nav = screen.getByTestId('nav-tab-list');
    fireEvent.scroll(nav, { target: { scrollLeft: 1000 } });
    const leftButton = screen.getByTestId('button:left-arrow');
    fireEvent.click(leftButton);
    expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith({
      left: -200,
      behavior: 'smooth',
    });
  });

  it('adds and removes event listeners', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderComponent();
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});
