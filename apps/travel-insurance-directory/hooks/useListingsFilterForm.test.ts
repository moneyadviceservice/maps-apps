import { useRouter } from 'next/router';

import { act, renderHook } from '@testing-library/react';

import { useListingsFilterForm } from './useListingsFilterForm';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function createFormWithInputs(
  inputs: { name: string; value: string }[],
  formId = 'filter-menu',
): {
  form: HTMLFormElement;
  [name: string]: HTMLFormElement | HTMLInputElement;
} {
  const form = document.createElement('form');
  form.id = formId;
  const elements: Record<string, HTMLInputElement> = {};
  inputs.forEach(({ name, value }) => {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.value = value;
    form.appendChild(input);
    elements[name] = input;
  });
  return { form, ...elements } as {
    form: HTMLFormElement;
    [name: string]: HTMLFormElement | HTMLInputElement;
  };
}

function changeEvent(
  form: HTMLFormElement,
  target: HTMLElement,
): React.ChangeEvent<HTMLFormElement> {
  return {
    currentTarget: form,
    target,
  } as unknown as React.ChangeEvent<HTMLFormElement>;
}

describe('useListingsFilterForm', () => {
  const mockReplace = jest.fn();
  const lang = 'en';
  const query = { p: '1' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      asPath: '/en/listings',
      push: jest.fn(),
      replace: mockReplace,
      events: { on: jest.fn(), off: jest.fn() },
    });
    sessionStorage.clear();
  });

  it('returns isFilterLoading and onFormChange', () => {
    const { result } = renderHook(() => useListingsFilterForm(lang, query));

    expect(result.current).toHaveProperty('isFilterLoading', false);
    expect(result.current).toHaveProperty('onFormChange');
    expect(typeof result.current.onFormChange).toBe('function');
  });

  it('ignores onFormChange when form id is not filter-menu', () => {
    const { result } = renderHook(() => useListingsFilterForm(lang, query));
    const { form, topic } = createFormWithInputs(
      [{ name: 'topic', value: 'medical' }],
      'other-form',
    );

    act(() => {
      result.current.onFormChange(changeEvent(form, topic));
    });

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('calls router.replace with built path when field changes', () => {
    const { result } = renderHook(() => useListingsFilterForm(lang, query));
    const { form, topic } = createFormWithInputs([
      { name: 'lang', value: 'en' },
      { name: 'topic', value: 'medical' },
    ]);

    act(() => {
      result.current.onFormChange(changeEvent(form, topic));
    });

    expect(mockReplace).toHaveBeenCalledWith('/en/listings?topic=medical');
  });

  it('submits form when age checkbox changes', () => {
    const { result } = renderHook(() => useListingsFilterForm(lang, query));
    const { form, age } = createFormWithInputs([
      { name: 'age', value: '0-16' },
    ]);

    act(() => {
      result.current.onFormChange(changeEvent(form, age));
    });

    expect(mockReplace).toHaveBeenCalledWith('/en/listings?age=0-16');
  });

  it('sets isFilterLoading to true when form changes', () => {
    const { result } = renderHook(() => useListingsFilterForm(lang, query));
    const { form, lang: langInput } = createFormWithInputs([
      { name: 'lang', value: 'en' },
    ]);

    expect(result.current.isFilterLoading).toBe(false);
    act(() => {
      result.current.onFormChange(changeEvent(form, langInput));
    });
    expect(result.current.isFilterLoading).toBe(true);
  });

  it('saves scroll position to sessionStorage when form changes', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    Object.defineProperty(globalThis, 'scrollY', {
      value: 150,
      writable: true,
    });
    const { result } = renderHook(() => useListingsFilterForm(lang, query));
    const { form, lang: input } = createFormWithInputs([
      { name: 'lang', value: 'en' },
    ]);

    act(() => {
      result.current.onFormChange(changeEvent(form, input));
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      'travel-insurance-listings-scroll',
      '150',
    );
    setItemSpy.mockRestore();
  });

  it('pops scroll position from sessionStorage on mount', () => {
    sessionStorage.setItem('travel-insurance-listings-scroll', '200');
    renderHook(() => useListingsFilterForm(lang, query));
    expect(
      sessionStorage.getItem('travel-insurance-listings-scroll'),
    ).toBeNull();
  });

  it('uses custom scrollKey from options', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    Object.defineProperty(globalThis, 'scrollY', {
      value: 100,
      writable: true,
    });
    const { form, topic } = createFormWithInputs([
      { name: 'topic', value: 'x' },
    ]);
    const { result } = renderHook(() =>
      useListingsFilterForm(lang, query, { scrollKey: 'custom-scroll-key' }),
    );

    act(() => {
      result.current.onFormChange(changeEvent(form, topic));
    });

    expect(setItemSpy).toHaveBeenCalledWith('custom-scroll-key', '100');
    setItemSpy.mockRestore();
  });

  it('routeChangeComplete clears loading state after minSkeletonMs', async () => {
    jest.useFakeTimers();
    const events: { [k: string]: () => void } = {};
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      asPath: '/en/listings',
      push: jest.fn(),
      replace: mockReplace,
      events: {
        on: jest.fn((ev: string, fn: () => void) => {
          events[ev] = fn;
        }),
        off: jest.fn(),
      },
    });
    const { form, topic } = createFormWithInputs([
      { name: 'topic', value: 'x' },
    ]);
    const { result } = renderHook(() =>
      useListingsFilterForm(lang, query, { minSkeletonMs: 400 }),
    );

    act(() => {
      result.current.onFormChange(changeEvent(form, topic));
    });
    expect(result.current.isFilterLoading).toBe(true);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    events.routeChangeComplete?.();
    act(() => {
      jest.advanceTimersByTime(350);
    });
    expect(result.current.isFilterLoading).toBe(false);
    jest.useRealTimers();
  });
});
