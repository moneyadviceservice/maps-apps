import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsComparisonTableSection } from './ResultsComparisonTableSection';
import {
  ResultsTableRow,
  FrequencyType,
  ResultsTableColumn,
} from 'components/ResultsTable';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: (t: { en: string }) => t.en }),
}));
jest.mock('../FrequencySelector/FrequencySelector', () => ({
  FrequencySelector: ({ currentFrequency, onFrequencyChange }: any) => (
    <select
      data-testid="frequency-selector"
      value={currentFrequency}
      onChange={(e) => onFrequencyChange(e.target.value)}
    >
      <option value="yearly">Yearly</option>
      <option value="monthly">Monthly</option>
    </select>
  ),
}));
jest.mock('../ResultsTable', () => ({
  ResultsTable: ({ rows }: any) => (
    <div data-testid="results-table">
      {rows.map((row: any) => (
        <div key={row.key}>{row.label.en}</div>
      ))}
    </div>
  ),
}));
jest.mock('@maps-react/common/components/ExpandableSection', () => ({
  ExpandableSection: ({ children }: any) => (
    <div data-testid="expandable-section">{children}</div>
  ),
}));
jest.mock('@maps-react/common/components/ListElement', () => ({
  ListElement: ({ items }: any) => (
    <ul>
      {items.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  ),
}));
jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: ({ children }: any) => <p>{children}</p>,
}));

const mockRows: ResultsTableRow[] = [
  {
    key: 'row1',
    label: { en: 'Row 1', cy: 'Row 1' },
    getValue: (frequency?: FrequencyType) => {
      if (frequency === 'yearly') return 1000;
      if (frequency === 'monthly') return 83.33;
      return 0;
    },
  },
  {
    key: 'row2',
    label: { en: 'Row 2', cy: 'Row 2' },
    getValue: (frequency?: FrequencyType) => {
      if (frequency === 'yearly') return 2000;
      if (frequency === 'monthly') return 166.67;
      return 0;
    },
  },
];

const mockColumns: ResultsTableColumn[] = [
  {
    header: { en: 'Col 1', cy: 'Col 1' },
    getValue: (row, freq) => row.getValue(freq),
  },
  {
    header: { en: 'Col 2', cy: 'Col 2' },
    getValue: (row, freq) => row.getValue(freq),
  },
];

const queryParamsObj = { salary1: 50000, salary2: 60000 };

describe('ResultsComparisonTableSection', () => {
  it('renders heading when showHeading is true', () => {
    render(
      <ResultsComparisonTableSection
        resultsFrequency="yearly"
        setResultsFrequency={jest.fn()}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
        showHeading={true}
      />,
    );

    expect(
      screen.getByText(/Your estimated take home pay for each salary/i),
    ).toBeInTheDocument();
  });

  it('does not render heading when showHeading is false', () => {
    render(
      <ResultsComparisonTableSection
        resultsFrequency="yearly"
        setResultsFrequency={jest.fn()}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
        showHeading={false}
      />,
    );

    expect(
      screen.queryByText(/Your estimated take home pay for each salary/i),
    ).toBeNull();
  });

  it('renders results table with correct rows and columns', () => {
    render(
      <ResultsComparisonTableSection
        resultsFrequency="yearly"
        setResultsFrequency={jest.fn()}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
      />,
    );

    expect(screen.getByTestId('results-table')).toBeInTheDocument();
    expect(screen.getByText('Row 1')).toBeInTheDocument();
  });

  it('renders expandable section with list items', () => {
    render(
      <ResultsComparisonTableSection
        resultsFrequency="yearly"
        setResultsFrequency={jest.fn()}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
      />,
    );

    expect(screen.getByTestId('expandable-section')).toBeInTheDocument();
    expect(screen.getByText(/a year is: 12 months/i)).toBeInTheDocument();
    expect(
      screen.getByText(/a week is: a five-day working week/i),
    ).toBeInTheDocument();
  });

  it('calls setResultsFrequency on frequency change', () => {
    const setResultsFrequency = jest.fn();
    render(
      <ResultsComparisonTableSection
        resultsFrequency="yearly"
        setResultsFrequency={setResultsFrequency}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
      />,
    );

    const selector = screen.getByTestId('frequency-selector');
    fireEvent.change(selector, { target: { value: 'monthly' } });
    expect(setResultsFrequency).toHaveBeenCalledWith('monthly');
  });
});
