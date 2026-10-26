import { render, screen } from '@testing-library/react';
import { GuidanceSection } from './GuidanceSection';
import '@testing-library/jest-dom';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn(() => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'test.section.title': 'Test Section Title',
        'test.section.paragraph1': 'This is paragraph 1',
        'test.section.listItem1': 'List item 1',
        'test.section.listItem2': 'List item 2 with sublist:',
        'test.section.sublistItem1': 'Sublist item 1',
        'test.section.sublistItem2': 'Sublist item 2',
        'test.section.sublistItem3': 'Sublist item 3',
        'test.section.markdownListItem1':
          'List item with [link](https://example.com)',
      };
      return translations[key] || key;
    },
  })),
}));

describe('GuidanceSection', () => {
  it('should render multiple content types including lists with sublists', () => {
    render(
      <GuidanceSection
        translationPrefix="test.section"
        testId="test-section"
        contentId="test-content"
        content={[
          { type: 'markdown', key: 'paragraph1' },
          {
            type: 'list',
            items: [
              { type: 'listItem', key: 'listItem1' },
              {
                type: 'listItem',
                key: 'listItem2',
                sublist: [
                  { key: 'sublistItem1' },
                  { key: 'sublistItem2' },
                  { key: 'sublistItem3' },
                ],
              },
            ],
          },
        ]}
      />,
    );

    // Verify title
    const title = screen.getByTestId('summary-block-title');
    expect(title).toHaveTextContent('Test Section Title');

    // Verify paragraph
    expect(screen.getByText('This is paragraph 1')).toBeInTheDocument();

    // Verify main list items
    expect(screen.getByText('List item 1')).toBeInTheDocument();
    expect(screen.getByText('List item 2 with sublist:')).toBeInTheDocument();

    // Verify sublist items
    expect(screen.getByText('Sublist item 1')).toBeInTheDocument();
    expect(screen.getByText('Sublist item 2')).toBeInTheDocument();
    expect(screen.getByText('Sublist item 3')).toBeInTheDocument();

    // Verify there are two lists (main list and nested sublist)
    const lists = screen.getAllByRole('list');
    expect(lists).toHaveLength(2);

    // Verify sublist has the correct class name
    const sublist = lists[1];
    expect(sublist).toHaveClass('ml-6', 'mt-1', 'list-[circle]');
  });
});
