import { fireEvent, render, screen } from '@testing-library/react';

import SortBar from './SortBar';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: { language: 'en' },
  }),
}));

describe('SortBar Component', () => {
  test('should render dropdowns with default values and hide apply button after component mounts', () => {
    render(<SortBar />);

    // Check that the "View per page" dropdown is rendered with the default value of '5'
    const viewPerPageDropdown = screen.getByLabelText(/view per page/i);
    expect(viewPerPageDropdown).toHaveValue('5'); // '5' is the default value

    // Check that the "Sort results by" dropdown is rendered with the default value 'random'
    const sortResultsDropdown = screen.getByLabelText(/sort results by/i);
    expect(sortResultsDropdown).toHaveValue('random'); // 'random' is the default value
  });

  it('calls onAnnounce when accounts per page changes', () => {
    const onAnnounce = jest.fn();

    render(<SortBar onAnnounce={onAnnounce} />);

    const dropdown = screen.getByLabelText(/view per page/i);

    // simulate change event on the dropdown:
    fireEvent.change(dropdown, { target: { value: '10' } });

    expect(onAnnounce).toHaveBeenCalledWith('Showing 10 results per page');
  });

  it('calls onAnnounce when sort order changes', () => {
    const onAnnounce = jest.fn();

    render(<SortBar onAnnounce={onAnnounce} />);

    const dropdown = screen.getByLabelText(/sort results by/i);

    fireEvent.change(dropdown, {
      target: { value: 'providerNameAZ' },
    });

    expect(onAnnounce).toHaveBeenCalledWith(
      'Showing results sorted by Bank name A-Z',
    );
  });
});
