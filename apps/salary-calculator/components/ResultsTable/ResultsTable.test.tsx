import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { ResultsTable } from './ResultsTable';
import type {
  FrequencyType,
  ResultsTableRow,
  ResultsTableColumn,
} from './ResultsTable';
import userEvent from '@testing-library/user-event';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({
    z: (obj: { en: string; cy: string }) => obj.en,
  }),
}));

const formatValue = (value: number): string => {
  const formatted = value.toFixed(2);
  return `£${formatted.replace(/\.00$/, '')}`;
};

const mockRows: ResultsTableRow[] = [
  {
    key: 'gross-income',
    label: { en: 'Gross income', cy: 'Incwm gros' },
    getValue: (frequency?: FrequencyType) =>
      ({
        yearly: 50000,
        monthly: 4166.67,
        weekly: 961.54,
        daily: 136.99,
      }[frequency ?? 'monthly']),
    isBold: true,
    className: 'border-b-2',
  },
  {
    key: 'tax',
    label: { en: 'Tax', cy: 'Treth' },
    getValue: (frequency?: FrequencyType) =>
      ({
        yearly: 7486,
        monthly: 623.83,
        weekly: 143.96,
        daily: 20.57,
      }[frequency ?? 'monthly']),
  },
  {
    key: 'national-insurance',
    label: { en: 'National Insurance', cy: 'Yswiriant Gwladol' },
    getValue: (frequency?: FrequencyType) =>
      ({
        yearly: 4628,
        monthly: 385.67,
        weekly: 89,
        daily: 12.71,
      }[frequency ?? 'monthly']),
  },
];

const mockSingleColumn: ResultsTableColumn[] = [
  {
    getValue: (row, freq) => formatValue(row.getValue(freq)),
  },
];

const mockComparisonColumns: ResultsTableColumn[] = [
  {
    header: { en: 'Salary 1', cy: 'Cyflog 1' },
    getValue: (row, freq) => formatValue(row.getValue(freq)),
  },
  {
    header: { en: 'Salary 2', cy: 'Cyflog 2' },
    getValue: (row, freq) => formatValue(row.getValue(freq) * 1.2),
  },
];

const renderTable = (
  columns = mockSingleColumn,
  frequency: FrequencyType = 'monthly',
  rows = mockRows,
) =>
  render(<ResultsTable rows={rows} columns={columns} frequency={frequency} />);

jest.mock('@maps-react/common/components/ExpandableSection', () => ({
  ExpandableSection: ({
    open,
    onClick,
    title,
    closedTitle,
    children,
    ...rest
  }: any) => (
    <div>
      <button
        aria-expanded={open}
        onClick={onClick}
        data-testid="expand-toggle"
      >
        {open ? closedTitle : title}
      </button>
      {open && <div data-testid="expand-content">{children}</div>}
    </div>
  ),
}));

// Mock expandableContentMap for predictable output
jest.mock('./config/expandableContentMap', () => ({
  expandableContentMap: {
    testKey: (z: any) => z({ en: 'Expandable content', cy: 'Cynnwys ehangu' }),
    anotherKey: (z: any) => z({ en: 'Another content', cy: 'Cynnwys arall' }),
  },
}));

beforeEach(() => jest.clearAllMocks());

describe('ResultsTable', () => {
  describe('Single column rendering', () => {
    it('renders table and labels', () => {
      renderTable();
      expect(screen.getByRole('table')).toBeInTheDocument();
      mockRows.forEach((r) =>
        expect(screen.getByText(r.label.en)).toBeInTheDocument(),
      );
    });

    it.each([
      ['monthly', ['£4166.67', '£623.83', '£385.67']],
      ['yearly', ['£50000', '£7486', '£4628']],
      ['weekly', ['£961.54', '£143.96', '£89']],
      ['daily', ['£136.99', '£20.57', '£12.71']],
    ])('renders values for %s frequency', (freq, expectedValues) => {
      renderTable(mockSingleColumn, freq as FrequencyType);
      expectedValues.forEach((v) =>
        expect(screen.getByText(v)).toBeInTheDocument(),
      );
    });

    it('does not render thead when no headers exist', () => {
      renderTable();
      expect(
        screen.getByRole('table').querySelector('thead'),
      ).not.toBeInTheDocument();
    });

    it('applies bold row styling', () => {
      renderTable();
      expect(screen.getByText('Gross income')).toHaveClass('font-bold');
      expect(screen.getByText('Tax')).not.toHaveClass('font-bold');
    });

    it('applies custom row className', () => {
      renderTable();
      expect(screen.getByText('Gross income').closest('tr')).toHaveClass(
        'border-b-2',
      );
    });
  });

  describe('Comparison columns rendering', () => {
    it('renders headers when present', () => {
      renderTable(mockComparisonColumns);
      expect(screen.getByText('Salary 1')).toBeInTheDocument();
      expect(screen.getByText('Salary 2')).toBeInTheDocument();
    });

    it('renders the correct number of columns', () => {
      renderTable(mockComparisonColumns);
      const cells = screen.getAllByRole('row')[1].querySelectorAll('td');
      expect(cells).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('has a valid table structure', () => {
      renderTable();
      expect(screen.getAllByRole('row').length).toBe(mockRows.length);
    });

    it('renders columnheaders only when provided', () => {
      renderTable(mockComparisonColumns);
      expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0);

      renderTable(mockSingleColumn);
      expect(screen.queryAllByRole('columnheader')).toHaveLength(3);
    });
  });

  describe('Custom styling', () => {
    it('applies wrapper className', () => {
      const { container } = render(
        <ResultsTable
          rows={mockRows}
          columns={mockSingleColumn}
          frequency="monthly"
          className="wrapper"
        />,
      );
      expect(container.firstChild).toHaveClass('wrapper');
    });

    it('applies table className', () => {
      render(
        <ResultsTable
          rows={mockRows}
          columns={mockSingleColumn}
          frequency="monthly"
          tableClassName="table-class"
        />,
      );
      expect(screen.getByRole('table')).toHaveClass('table-class');
    });
  });

  describe('Edge cases', () => {
    it('handles empty rows array', () => {
      renderTable(mockSingleColumn, 'monthly', []);
      expect(screen.queryAllByRole('row')).toHaveLength(0);
    });

    it('handles minimal rows', () => {
      renderTable(mockSingleColumn, 'monthly', [
        {
          key: 'basic-row',
          label: { en: 'Basic row', cy: '' },
          getValue: () => 100,
        },
      ]);
      expect(screen.getByText('Basic row')).toBeInTheDocument();
      expect(screen.getByText('£100')).toBeInTheDocument();
    });

    it('supports string-returning columns', () => {
      renderTable(
        [{ getValue: (row, freq) => `Value: ${row.getValue(freq)}` }],
        'monthly',
        mockRows.slice(0, 1),
      );
      expect(screen.getByText('Value: 4166.67')).toBeInTheDocument();
    });

    it('supports number-returning columns', () => {
      renderTable(
        [{ getValue: (row, freq) => row.getValue(freq) }],
        'monthly',
        mockRows.slice(0, 1),
      );
      expect(screen.getByText('4166.67')).toBeInTheDocument();
    });
  });

  describe('Welsh translation support', () => {
    it('uses z() for translation', () => {
      const { rerender } = renderTable();

      jest
        .spyOn(require('@maps-react/hooks/useTranslation'), 'useTranslation')
        .mockReturnValue({ z: (obj: { cy: string }) => obj.cy });

      rerender(
        <ResultsTable
          rows={mockRows}
          columns={mockSingleColumn}
          frequency="monthly"
        />,
      );

      expect(screen.getByText('Incwm gros')).toBeInTheDocument();
      expect(screen.getByText('Treth')).toBeInTheDocument();
    });

    it('translates column headers', () => {
      jest
        .spyOn(require('@maps-react/hooks/useTranslation'), 'useTranslation')
        .mockReturnValue({ z: (obj: { cy: string }) => obj.cy });

      renderTable(mockComparisonColumns);
      expect(screen.getByText('Cyflog 1')).toBeInTheDocument();
      expect(screen.getByText('Cyflog 2')).toBeInTheDocument();
    });

    it('renders empty string when column header is undefined', () => {
      const columns: ResultsTableColumn[] = [
        { getValue: (row, freq) => 'Value' }, // no header
      ];
      const rows: ResultsTableRow[] = [
        { key: 'row', label: { en: 'Row', cy: 'Rhes' }, getValue: () => 123 },
      ];

      render(
        <ResultsTable rows={rows} columns={columns} frequency="monthly" />,
      );

      expect(screen.getByRole('table')).toBeInTheDocument();

      const headerCells = screen.queryAllByText('');
      expect(headerCells.length).toBeGreaterThan(0);
    });
  });

  describe('ResultsTable expandable rows', () => {
    const expandableRow = {
      key: 'grossIncome',
      label: { en: 'Gross income', cy: 'Incwm gros' },
      getValue: () => 100,
      expandableKey: 'testKey',
    };
    const anotherExpandableRow = {
      key: 'totalDeductions',
      label: { en: 'Deductions', cy: 'Cyfanswm didyniadau' },
      getValue: () => 50,
      expandableKey: 'anotherKey',
    };
    const columns = [{ getValue: (row: any) => row.getValue() }];

    it('renders expandable section closed by default', () => {
      render(
        <ResultsTable
          rows={[expandableRow]}
          columns={columns}
          frequency="monthly"
        />,
      );
      expect(screen.queryByTestId('expand-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('expand-toggle')).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('toggles expandable section open and closed on click', async () => {
      render(
        <ResultsTable
          rows={[expandableRow]}
          columns={columns}
          frequency="monthly"
        />,
      );
      const toggle = screen.getByTestId('expand-toggle');
      // Open
      await userEvent.click(toggle);
      expect(screen.getByTestId('expand-toggle')).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getByTestId('expand-content')).toHaveTextContent(
        'Cynnwys ehangu',
      );
      // Close
      await userEvent.click(toggle);
      expect(screen.getByTestId('expand-toggle')).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.queryByTestId('expand-content')).not.toBeInTheDocument();
    });

    it('renders correct content for each expandableKey', async () => {
      // Ensure useTranslation returns English for this test
      jest
        .spyOn(require('@maps-react/hooks/useTranslation'), 'useTranslation')
        .mockReturnValue({ z: (obj: { en: string }) => obj.en });

      render(
        <ResultsTable
          rows={[expandableRow, anotherExpandableRow]}
          columns={columns}
          frequency="monthly"
        />,
      );
      const toggles = screen.getAllByTestId('expand-toggle');
      // Expand first
      await userEvent.click(toggles[0]);
      expect(screen.getByTestId('expand-content')).toHaveTextContent(
        'Expandable content',
      );
      // Expand second
      await userEvent.click(toggles[1]);
      // Both expanded content should be present
      expect(screen.getAllByTestId('expand-content')[1]).toHaveTextContent(
        'Another content',
      );
    });

    it('maintains independent expanded state for multiple expandable rows', async () => {
      render(
        <ResultsTable
          rows={[expandableRow, anotherExpandableRow]}
          columns={columns}
          frequency="monthly"
        />,
      );
      const toggles = screen.getAllByTestId('expand-toggle');
      // Expand first
      await userEvent.click(toggles[0]);
      expect(screen.getAllByTestId('expand-toggle')[0]).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getAllByTestId('expand-toggle')[1]).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      // Expand second
      await userEvent.click(toggles[1]);
      expect(screen.getAllByTestId('expand-toggle')[0]).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      expect(screen.getAllByTestId('expand-toggle')[1]).toHaveAttribute(
        'aria-expanded',
        'true',
      );
      // Collapse first
      await userEvent.click(toggles[0]);
      expect(screen.getAllByTestId('expand-toggle')[0]).toHaveAttribute(
        'aria-expanded',
        'false',
      );
      expect(screen.getAllByTestId('expand-toggle')[1]).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });
});
