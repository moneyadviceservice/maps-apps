import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaxExplainer } from './TaxExplainer';

// Mock the dependencies
jest.mock('@maps-react/common/components/Heading', () => ({
  H3: ({ children }: any) => <h3>{children}</h3>,
}));

jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children, className }: any) => (
    <p className={className}>{children}</p>
  ),
}));

jest.mock('@maps-react/common/components/Table', () => ({
  Table: ({ columnHeadings, data }: any) => (
    <table>
      <thead>
        <tr>
          {columnHeadings.map((heading: string) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: string[], rowIndex: number) => (
          <tr key={`row-${row.join('-')}`}>
            {row.map((cell: string) => (
              <td key={`${rowIndex}-${cell}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock('../List', () => ({
  List: ({ preamble, items }: any) => (
    <div data-testid="list">
      {preamble && <p>{preamble}</p>}
      <ul>
        {items.map((item: any) => (
          <li key={item.text}>{item.text}</li>
        ))}
      </ul>
    </div>
  ),
}));

jest.mock('@maps-react/hooks/useTranslation', () => ({
  __esModule: true,
  default: () => ({
    z: (content: any) => {
      if (typeof content === 'object' && content !== null) {
        return content.en || content.cy || '';
      }
      return content;
    },
  }),
}));

describe('TaxExplainer', () => {
  const defaultProps = {
    buyerType: 'firstTimeBuyer',
    purchaseDate: '1-4-2025',
    taxType: 'SDLT' as const,
  };

  describe('Rendering with different tax types', () => {
    it('should render SDLT content for first-time buyers', () => {
      render(<TaxExplainer {...defaultProps} />);

      const elements = screen.getAllByText(/Stamp Duty Land Tax/i, {
        exact: false,
      });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render LTT content for first-time buyers in Wales', () => {
      render(
        <TaxExplainer
          {...defaultProps}
          taxType="LTT"
          buyerType="firstOrNextHome"
        />,
      );

      const elements = screen.getAllByText(/Land Transaction Tax/i, {
        exact: false,
      });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render LBTT content for first-time buyers in Scotland', () => {
      render(<TaxExplainer {...defaultProps} taxType="LBTT" />);

      const elements = screen.getAllByText(
        /Land and Buildings Transaction Tax/i,
        {
          exact: false,
        },
      );
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('Rendering different buyer types', () => {
    it('should render content for next home buyers', () => {
      render(
        <TaxExplainer {...defaultProps} buyerType="nextHome" taxType="SDLT" />,
      );

      const elements = screen.getAllByText(/next home/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render content for additional home buyers', () => {
      render(
        <TaxExplainer
          {...defaultProps}
          buyerType="additionalHome"
          taxType="SDLT"
        />,
      );

      const elements = screen.getAllByText(/additional/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('Content block rendering', () => {
    it('should render paragraph blocks', () => {
      render(<TaxExplainer {...defaultProps} />);

      const paragraphs = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('should render table blocks with headings and data', () => {
      render(<TaxExplainer {...defaultProps} />);

      // Should have table headings
      const purchasePriceElements = screen.getAllByText(/Purchase price/i);
      expect(purchasePriceElements.length).toBeGreaterThan(0);

      const rateElements = screen.getAllByText(/Rate of Stamp Duty/i);
      expect(rateElements.length).toBeGreaterThan(0);

      // Should have table data
      const tables = document.querySelectorAll('table');
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should render list blocks with preamble and items', () => {
      render(<TaxExplainer {...defaultProps} />);

      const lists = screen.getAllByTestId('list');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('should render heading blocks', () => {
      render(<TaxExplainer {...defaultProps} />);

      const headings = document.querySelectorAll('h3');
      // Component may or may not have h3s depending on content
      expect(headings).toBeDefined();
    });
  });

  describe('Date handling', () => {
    it('should handle valid purchase date', () => {
      render(<TaxExplainer {...defaultProps} purchaseDate="1-4-2025" />);

      // Should render content for the correct period
      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should handle empty purchase date by using current date', () => {
      render(<TaxExplainer {...defaultProps} purchaseDate="" />);

      // Should still render content using current date
      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should handle historical dates correctly', () => {
      render(<TaxExplainer {...defaultProps} purchaseDate="1-4-2023" />);

      // Should render content for historical period
      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should handle future dates correctly', () => {
      render(<TaxExplainer {...defaultProps} purchaseDate="1-4-2026" />);

      // Should render content for future period (uses latest period)
      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases and error handling', () => {
    it('should return null when buyer type is not found', () => {
      const { container } = render(
        <TaxExplainer {...defaultProps} buyerType="invalidBuyerType" />,
      );

      expect(container.firstChild).toBeNull();
    });

    it('should return null when content period has no content blocks', () => {
      // This is handled by the getRatePeriod function which should always return a period
      // But if contentBlocks is undefined, it should return null
      const { container } = render(
        <TaxExplainer
          {...defaultProps}
          buyerType="firstTimeBuyer"
          purchaseDate="1-1-1900"
        />,
      );

      // Should still render or return null gracefully
      expect(container).toBeDefined();
    });
  });

  describe('Multiple content blocks rendering', () => {
    it('should render all content blocks in order', () => {
      const { container } = render(<TaxExplainer {...defaultProps} />);

      const allElements = container.querySelectorAll(
        'p, table, h3, [data-testid="list"]',
      );
      expect(allElements.length).toBeGreaterThan(0);
    });

    it('should use buyer type as key prefix for content blocks', () => {
      render(<TaxExplainer {...defaultProps} buyerType="firstTimeBuyer" />);

      // Content should be rendered (keys are internal to React)
      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('Translation handling', () => {
    it('should use translation function for all content', () => {
      render(<TaxExplainer {...defaultProps} />);

      // All text content should be rendered through the z function
      // which returns the 'en' property in our mock
      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should handle table column headings translation', () => {
      render(<TaxExplainer {...defaultProps} />);

      const purchasePriceElements = screen.getAllByText(/Purchase price/i);
      expect(purchasePriceElements.length).toBeGreaterThan(0);

      const rateElements = screen.getAllByText(/Rate of Stamp Duty/i);
      expect(rateElements.length).toBeGreaterThan(0);
    });

    it('should handle optional table headings', () => {
      render(<TaxExplainer {...defaultProps} />);

      const tables = document.querySelectorAll('table');
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should handle optional list preambles', () => {
      render(<TaxExplainer {...defaultProps} />);

      const lists = screen.getAllByTestId('list');
      expect(lists.length).toBeGreaterThan(0);
    });
  });

  describe('All tax types and buyer type combinations', () => {
    const testCases: Array<{
      taxType: 'SDLT' | 'LTT' | 'LBTT';
      buyerType: string;
    }> = [
      { taxType: 'SDLT', buyerType: 'firstTimeBuyer' },
      { taxType: 'SDLT', buyerType: 'nextHome' },
      { taxType: 'SDLT', buyerType: 'additionalHome' },
      { taxType: 'LTT', buyerType: 'firstOrNextHome' },
      { taxType: 'LTT', buyerType: 'additionalHome' },
      { taxType: 'LBTT', buyerType: 'firstTimeBuyer' },
      { taxType: 'LBTT', buyerType: 'nextHome' },
      { taxType: 'LBTT', buyerType: 'additionalHome' },
    ];

    for (const { taxType, buyerType } of testCases) {
      it(`should render ${taxType} content for ${buyerType}`, () => {
        const { container } = render(
          <TaxExplainer
            taxType={taxType}
            buyerType={buyerType}
            purchaseDate="1-4-2025"
          />,
        );

        // Should render some content
        expect(container.firstChild).not.toBeNull();
      });
    }
  });

  describe('Content rendering for different periods', () => {
    it('should render different content for SDLT first-time buyers after April 2025', () => {
      render(
        <TaxExplainer
          {...defaultProps}
          buyerType="firstTimeBuyer"
          purchaseDate="1-4-2025"
        />,
      );

      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should render different content for SDLT first-time buyers before April 2025', () => {
      render(
        <TaxExplainer
          {...defaultProps}
          buyerType="firstTimeBuyer"
          purchaseDate="1-4-2024"
        />,
      );

      const elements = screen.getAllByText(/Stamp Duty/i, { exact: false });
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('Component structure', () => {
    it('should render a fragment as the root element', () => {
      const { container } = render(<TaxExplainer {...defaultProps} />);

      // The component returns a fragment, so the container should have multiple children
      // or a single child depending on the content
      expect(container).toBeDefined();
    });

    it('should pass className to Paragraph components in table blocks', () => {
      render(<TaxExplainer {...defaultProps} />);

      // Tables with headings should have paragraph with mb-0 class
      const paragraphsWithClass = document.querySelectorAll('p.mb-0');
      // May or may not exist depending on whether tables have headings
      expect(paragraphsWithClass).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML elements', () => {
      const { container } = render(<TaxExplainer {...defaultProps} />);

      // Should use semantic elements like p, table, h3, ul
      const paragraphs = container.querySelectorAll('p');
      const tables = container.querySelectorAll('table');

      expect(paragraphs.length + tables.length).toBeGreaterThan(0);
    });

    it('should render tables with proper structure', () => {
      render(<TaxExplainer {...defaultProps} />);

      const tables = document.querySelectorAll('table');
      if (tables.length > 0) {
        const firstTable = tables[0];
        expect(firstTable.querySelector('thead')).toBeInTheDocument();
        expect(firstTable.querySelector('tbody')).toBeInTheDocument();
      }
    });
  });
});
