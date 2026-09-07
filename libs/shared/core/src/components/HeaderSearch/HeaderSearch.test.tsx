import { fireEvent, render, screen } from '@testing-library/react';

import { HeaderSearch } from './HeaderSearch';

import '@testing-library/jest-dom';

let onClickOutsideHandler: (() => void) | undefined;

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
  }),
}));

jest.mock('@maps-react/hooks/useOnClickOutside', () => ({
  useOnClickOutside: (_ref: unknown, handler: () => void) => {
    onClickOutsideHandler = handler;
  },
}));

describe('HeaderSearch', () => {
  beforeEach(() => {
    onClickOutsideHandler = undefined;
  });

  it('toggles open on click and closes navigation when opening', () => {
    const setIsOpen = jest.fn();
    const closeNavigation = jest.fn();

    render(
      <HeaderSearch
        language="en"
        isOpen={false}
        setIsOpen={setIsOpen}
        closeNavigation={closeNavigation}
      />,
    );

    fireEvent.click(screen.getByTestId('search-toggle'));

    expect(closeNavigation).toHaveBeenCalledTimes(1);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it('toggles closed on click without closing navigation', () => {
    const setIsOpen = jest.fn();
    const closeNavigation = jest.fn();

    render(
      <HeaderSearch
        language="en"
        isOpen={true}
        setIsOpen={setIsOpen}
        closeNavigation={closeNavigation}
      />,
    );

    fireEvent.click(screen.getByTestId('search-toggle'));

    expect(closeNavigation).not.toHaveBeenCalled();
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('toggles open on Enter keypress', () => {
    const setIsOpen = jest.fn();
    const closeNavigation = jest.fn();

    render(
      <HeaderSearch
        language="en"
        isOpen={false}
        setIsOpen={setIsOpen}
        closeNavigation={closeNavigation}
      />,
    );

    fireEvent.keyDown(screen.getByTestId('search-toggle'), { key: 'Enter' });

    expect(closeNavigation).toHaveBeenCalledTimes(1);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it('closes when clicking outside', () => {
    const setIsOpen = jest.fn();

    render(
      <HeaderSearch
        language="en"
        isOpen={true}
        setIsOpen={setIsOpen}
        closeNavigation={jest.fn()}
      />,
    );

    expect(onClickOutsideHandler).toBeDefined();
    onClickOutsideHandler?.();

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  it('submits search form with correct action and query parameter', () => {
    render(
      <HeaderSearch
        language="en"
        isOpen={true}
        setIsOpen={jest.fn()}
        closeNavigation={jest.fn()}
      />,
    );

    const form = document.querySelector(
      '.t-header-search-form',
    ) as HTMLFormElement;

    // Verify form has correct action
    expect(form.action).toBe(
      'https://www.moneyhelper.org.uk/en/search-results.html',
    );
    expect(form.method).toBe('get');

    // Verify form data is correct
    const input = screen.getByPlaceholderText('How can we help you today?');
    fireEvent.change(input, { target: { value: 'test query' } });

    const formData = new FormData(form);
    expect(formData.get('q')).toBe('test query');
  });
});
