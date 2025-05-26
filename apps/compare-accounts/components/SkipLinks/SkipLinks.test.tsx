import { render } from '@testing-library/react';

import SkipLinks from './SkipLinks';

import '@testing-library/jest-dom';
jest.mock('next/router', () => require('next-router-mock'));

const renderSkipLinks = (
  skipLinks = [{ focusID: 'link1', label: 'Link 1', testID: 'test-link-1' }],
) => render(<SkipLinks skipLinks={skipLinks} />);

describe('SkipLinks component', () => {
  it('renders correctly', () => {
    const { container } = renderSkipLinks();
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with multiple skip links', () => {
    const { container } = renderSkipLinks([
      { focusID: 'link1', label: 'Link 1', testID: 'test-link-1' },
      { focusID: 'link2', label: 'Link 2', testID: 'test-link-2' },
    ]);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('applies correct classes to the skip links', () => {
    const { container } = renderSkipLinks();

    const link = container.querySelector('a');

    expect(link).toHaveClass(
      'relative',
      'outline-none',
      'font-bold',
      'text-sm',
      'p-3',
      'pr-6',
      'pl-6',
      'rounded',
      'bg-pink-600',
      'text-white',
      'shadow-bottom-gray',
      'mr-2',
      'top-1',
      'focus:text-gray-800',
      'focus:bg-yellow-200',
      'focus:border-b-purple-800',
      'focus:border-b-4',
      'hover:bg-white',
      'hover:border-none',
      'hover:text-blue-800',
    );
  });

  it('applies correct container styles', () => {
    const { container } = renderSkipLinks();

    const divContainer = container.querySelector('div');

    expect(divContainer).toHaveClass(
      'sr-only',
      'focus-within:not-sr-only',
      'focus-within:absolute',
      'focus-within:top-1',
      'focus-within:left-1',
      'focus-within:z-20',
    );
  });
});
