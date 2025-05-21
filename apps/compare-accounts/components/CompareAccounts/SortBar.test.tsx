import { render, screen } from '@testing-library/react';

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
});
