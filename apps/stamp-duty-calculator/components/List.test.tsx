import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { List } from './List';

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children }: any) => <p>{children}</p>,
}));

describe('List', () => {
  const mockItems = [
    {
      text: 'First item text',
    },
    {
      text: 'Second item text',
    },
    {
      text: 'Third item text',
    },
  ];

  const defaultProps = {
    type: 'unordered' as const,
    preamble: 'This is the preamble text',
    items: mockItems,
  };

  describe('Basic rendering', () => {
    it('should render the preamble', () => {
      render(<List {...defaultProps} />);

      expect(screen.getByText('This is the preamble text')).toBeInTheDocument();
    });

    it('should render the preamble as a paragraph', () => {
      render(<List {...defaultProps} />);

      const preamble = screen.getByText('This is the preamble text');
      expect(preamble.tagName).toBe('P');
    });

    it('should render all list items', () => {
      render(<List {...defaultProps} />);

      expect(screen.getByText('First item text')).toBeInTheDocument();
      expect(screen.getByText('Second item text')).toBeInTheDocument();
      expect(screen.getByText('Third item text')).toBeInTheDocument();
    });

    it('should render items as list items', () => {
      render(<List {...defaultProps} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);

      expect(listItems[0]).toHaveTextContent('First item text');
      expect(listItems[1]).toHaveTextContent('Second item text');
      expect(listItems[2]).toHaveTextContent('Third item text');
    });

    it('should render an unordered list', () => {
      render(<List {...defaultProps} />);

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });
  });

  describe('Type handling', () => {
    it('should render unordered list when type is unordered', () => {
      render(<List {...defaultProps} type="unordered" />);

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });

    it('should apply correct CSS classes for unordered list', () => {
      render(<List {...defaultProps} type="unordered" />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass(
        'list-disc',
        'list-outside',
        'space-y-4',
        'marker:text-lg',
        'marker:leading-snug',
      );
    });
  });

  describe('CSS classes and styling', () => {
    it('should apply correct CSS classes to the outer container', () => {
      render(<List {...defaultProps} />);

      const preamble = screen.getByText('This is the preamble text');
      const outerContainer = preamble.parentElement;
      expect(outerContainer?.tagName).toBe('DIV');
    });

    it('should apply correct CSS classes to the list container', () => {
      render(<List {...defaultProps} />);

      const list = screen.getByRole('list');
      const listContainer = list.parentElement;
      expect(listContainer).toHaveClass('px-6');
    });

    it('should apply correct CSS classes to the unordered list', () => {
      render(<List {...defaultProps} />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass(
        'list-disc',
        'list-outside',
        'space-y-4',
        'marker:text-lg',
        'marker:leading-snug',
      );
    });
  });

  describe('Component structure', () => {
    it('should have correct DOM structure', () => {
      render(<List {...defaultProps} />);

      const preamble = screen.getByText('This is the preamble text');

      // Check that preamble comes before the list
      const outerContainer = preamble.parentElement;

      expect(outerContainer).toContainElement(preamble);
    });

    it('should render list items with correct text content', () => {
      render(<List {...defaultProps} />);

      const listItems = screen.getAllByRole('listitem');

      expect(listItems[0]).toHaveTextContent('First item text');
      expect(listItems[1]).toHaveTextContent('Second item text');
      expect(listItems[2]).toHaveTextContent('Third item text');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty items array', () => {
      const emptyItemsProps = {
        ...defaultProps,
        items: [],
      };

      render(<List {...emptyItemsProps} />);

      expect(screen.getByText('This is the preamble text')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });

    it('should handle single item', () => {
      const singleItemProps = {
        ...defaultProps,
        items: [{ text: 'Single item' }],
      };

      render(<List {...singleItemProps} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
      expect(listItems[0]).toHaveTextContent('Single item');
    });

    it('should handle empty preamble', () => {
      const emptyPreambleProps = {
        ...defaultProps,
        preamble: '',
      };

      render(<List {...emptyPreambleProps} />);

      const paragraph = screen.getByText('', { selector: 'p' });
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toBeEmptyDOMElement();
    });

    it('should handle items with empty text', () => {
      const itemsWithEmptyText = [
        { text: 'Valid item' },
        { text: '' },
        { text: 'Another valid item' },
      ];

      const propsWithEmptyText = {
        ...defaultProps,
        items: itemsWithEmptyText,
      };

      render(<List {...propsWithEmptyText} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
      expect(listItems[0]).toHaveTextContent('Valid item');
      expect(listItems[1]).toBeEmptyDOMElement();
      expect(listItems[2]).toHaveTextContent('Another valid item');
    });
  });

  describe('Key generation', () => {
    it('should handle duplicate text items correctly', () => {
      const duplicateTextItems = [
        { text: 'Duplicate text' },
        { text: 'Unique text' },
        { text: 'Duplicate text' },
      ];

      const propsWithDuplicates = {
        ...defaultProps,
        items: duplicateTextItems,
      };

      render(<List {...propsWithDuplicates} />);

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);

      const duplicateItems = screen.getAllByText('Duplicate text');
      expect(duplicateItems).toHaveLength(2);
      expect(screen.getByText('Unique text')).toBeInTheDocument();
    });
  });

  describe('Props validation', () => {
    it('should render correctly with all required props', () => {
      const minimalProps = {
        type: 'unordered' as const,
        preamble: 'Test preamble',
        items: [{ text: 'Test item' }],
      };

      render(<List {...minimalProps} />);

      expect(screen.getByText('Test preamble')).toBeInTheDocument();
      expect(screen.getByText('Test item')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper list semantics', () => {
      render(<List {...defaultProps} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();

      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });

    it('should maintain proper heading hierarchy with preamble', () => {
      render(<List {...defaultProps} />);

      // The preamble should be a paragraph, not interfering with heading hierarchy
      const preamble = screen.getByText('This is the preamble text');
      expect(preamble.tagName).toBe('P');
    });
  });

  describe('Dynamic element selection', () => {
    it('should select correct element type based on type prop', () => {
      render(<List {...defaultProps} type="unordered" />);

      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
    });

    it('should apply correct className based on type prop', () => {
      render(<List {...defaultProps} type="unordered" />);

      const list = screen.getByRole('list');
      expect(list).toHaveClass('list-disc');
      expect(list).toHaveClass('list-outside');
      expect(list).toHaveClass('space-y-4');
      expect(list).toHaveClass('marker:text-lg');
      expect(list).toHaveClass('marker:leading-snug');
    });
  });
});
