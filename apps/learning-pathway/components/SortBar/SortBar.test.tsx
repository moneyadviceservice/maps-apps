import { fireEvent, render, screen } from '@testing-library/react';

import SortBar from './SortBar';

import '@testing-library/jest-dom';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/[language]/learning-pathway',
    query: { language: 'en' },
    push: mockPush,
  }),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

describe('SortBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the provided orders as options', () => {
    render(
      <SortBar order="random" orders={['random', 'titleAZ', 'titleZA']} />,
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('random');
    expect(
      screen.getByRole('option', {
        name: 'learning-pathway-list.sort.titleAZ',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', {
        name: 'learning-pathway-list.sort.dateLaunched',
      }),
    ).not.toBeInTheDocument();
  });

  it('pushes the selected order to the URL', () => {
    render(
      <SortBar order="random" orders={['random', 'titleAZ', 'titleZA']} />,
    );

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'titleAZ' },
    });

    expect(mockPush).toHaveBeenCalledWith(
      {
        pathname: '/[language]/learning-pathway',
        query: { language: 'en', order: 'titleAZ' },
      },
      undefined,
      { scroll: false, shallow: false },
    );
  });

  it('pushes date launched sorting to the URL', () => {
    render(<SortBar order="random" orders={['random', 'dateLaunched']} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'dateLaunched' },
    });

    expect(mockPush).toHaveBeenCalledWith(
      {
        pathname: '/[language]/learning-pathway',
        query: { language: 'en', order: 'dateLaunched' },
      },
      undefined,
      { scroll: false, shallow: false },
    );
  });

  it('renders a polite live region announcing the sort order', () => {
    render(
      <SortBar order="random" orders={['random', 'titleAZ', 'titleZA']} />,
    );

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(
      'learning-pathway-list.sortAnnouncement',
    );
  });
});
