import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import Filter from './Filter';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
    asPath: '/some-path',
  }),
}));

describe('Filter Component', () => {
  it('notifies and resets announcements text after timeout', async () => {
    render(
      <Filter
        title="Test Filter"
        href="/some-path"
        description="Remove filter"
      />,
    );

    const removeFilterIcon = screen.getByTestId('remove-filter-icon');

    fireEvent.click(removeFilterIcon);

    const announcementContainer = screen.getByTestId('announcement-container');

    await waitFor(() => {
      expect(announcementContainer.textContent).toContain('filter removed');
    });

    await waitFor(() => {
      expect(announcementContainer.textContent).toBe('');
    });
  });
});
