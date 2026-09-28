import React from 'react';

import { render, screen } from '@testing-library/react';

import { TabHead } from './TabHead';

import '@testing-library/jest-dom/extend-expect';

type SvgProps = React.SVGProps<SVGSVGElement>;

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
});
