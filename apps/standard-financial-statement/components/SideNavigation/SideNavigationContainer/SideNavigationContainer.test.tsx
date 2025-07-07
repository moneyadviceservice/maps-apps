import { TabbableOptions } from 'tabbable';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { SideNavigationContainer } from './SideNavigationContainer';

import '@testing-library/jest-dom';

jest.mock('tabbable', () => {
  const originalTabbable = jest.requireActual('tabbable');

  return {
    ...originalTabbable,
    tabbable: (node: Node, options: TabbableOptions) =>
      originalTabbable.tabbable(node, { ...options, displayCheck: 'none' }),
    focusable: (node: Node, options: TabbableOptions) =>
      originalTabbable.focusable(node, { ...options, displayCheck: 'none' }),
    isFocusable: (node: Node, options: TabbableOptions) =>
      originalTabbable.isFocusable(node, { ...options, displayCheck: 'none' }),
    isTabbable: (node: Node, options: TabbableOptions) =>
      originalTabbable.isTabbable(node, { ...options, displayCheck: 'none' }),
  };
});

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    asPath: '/',
  }),
}));

describe('SideNavigationContainer', () => {
  it('toggles navigation when clicked', async () => {
    const { getByTestId, queryByTestId } = render(
      <SideNavigationContainer language="en">
        <button type="button">Content</button>
      </SideNavigationContainer>,
    );

    const toggleButton = screen.getByTestId('side-nav-toggle');

    expect(queryByTestId('nav-content')).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    await waitFor(() => expect(getByTestId('nav-content')).toBeInTheDocument());
  });

  it('closes navigation when clicking outside', () => {
    const { getByTestId, queryByTestId } = render(
      <SideNavigationContainer language="en">
        <button type="button">Content</button>
      </SideNavigationContainer>,
    );

    const toggleButton = screen.getByTestId('side-nav-toggle');

    fireEvent.click(toggleButton);
    expect(getByTestId('nav-content')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(queryByTestId('nav-content')).not.toBeInTheDocument();
  });
});
