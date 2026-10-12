import { render, screen } from '@testing-library/react';

import EmptyResults from './EmptyResults';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

describe('EmptyResults', () => {
  it('renders the component with correct structure', () => {
    const { container } = render(<EmptyResults />);
    expect(container).toMatchSnapshot();
  });

  it('displays the title heading', () => {
    render(<EmptyResults />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('empty-results.title');
  });

  it('displays the description paragraph', () => {
    render(<EmptyResults />);

    const paragraph = screen.getByText('empty-results.description.text');
    expect(paragraph).toBeInTheDocument();
  });

  it('renders the list element with all four items', () => {
    render(<EmptyResults />);

    const listItems = [
      'empty-results.description.list-1',
      'empty-results.description.list-2',
      'empty-results.description.list-3',
      'empty-results.description.list-4',
    ];

    listItems.forEach((item) => {
      const listItem = screen.getByText(item);
      expect(listItem).toBeInTheDocument();
    });
  });
});
