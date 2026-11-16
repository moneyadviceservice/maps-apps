import { render } from '@testing-library/react';

import useTranslation from '@maps-react/hooks/useTranslation';

import { ErrorContent } from './ErrorContent';

import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation');

const mockUseTranslation = useTranslation as jest.Mock;

describe('ErrorContent Component', () => {
  const mockItems = ['list item 1', 'list item 2', 'list item 3'];

  beforeEach(() => {
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
      tList: () => mockItems,
    });
  });

  it('renders component correctly', () => {
    const { container } = render(<ErrorContent items={mockItems} />);
    expect(container).toMatchSnapshot();
  });

  it.each`
    description                | expectedText
    ${'intro text'}            | ${'pages.error.intro'}
    ${'what-you-can-do title'} | ${'pages.error.what-you-can-do.title'}
  `('renders the $description', ({ expectedText }) => {
    const { container } = render(<ErrorContent items={mockItems} />);
    expect(container).toHaveTextContent(expectedText);
  });

  it('renders the correct number of list items', () => {
    const { container } = render(<ErrorContent items={mockItems} />);
    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(mockItems.length);
  });

  it('renders custom intro text when provided', () => {
    const propValue = 'Custom intro text';
    const props = { items: mockItems, intro: propValue };
    const { container } = render(<ErrorContent {...props} />);
    expect(container).toHaveTextContent(propValue);
  });
});
