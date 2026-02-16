import { render, screen, fireEvent } from '@testing-library/react';
import { ResultsSingleTableSection } from './ResultsSingleTableSection';
import '@testing-library/jest-dom';

import {
  ResultsTableRow,
  FrequencyType,
  ResultsTableColumn,
} from 'components/ResultsTable';

import {
  MockPieChart,
  MockFrequencySelector,
  MockResultsTableWithRows,
  MockExpandableSection,
  MockListElement,
  MockParagraph,
  mockZ,
} from '../../__mocks__/mockResultsComponents';

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: () => ({ z: mockZ }),
}));
jest.mock('../FrequencySelector/FrequencySelector', () => ({
  FrequencySelector: (props: any) => <MockFrequencySelector {...props} />,
}));
jest.mock('../ResultsTable', () => ({
  ResultsTable: (props: any) => <MockResultsTableWithRows {...props} />,
}));
jest.mock('@maps-react/common/components/ExpandableSection', () => ({
  ExpandableSection: (props: any) => <MockExpandableSection {...props} />,
}));
jest.mock('@maps-react/common/components/ListElement', () => ({
  ListElement: (props: any) => <MockListElement {...props} />,
}));
jest.mock('@maps-react/common/components/Paragraph', () => ({
  Paragraph: (props: any) => <MockParagraph {...props} />,
}));

jest.mock('@maps-react/common/components/PieChart', () => ({
  __esModule: true,
  default: (props: any) => <MockPieChart {...props} />,
}));

jest.mock('components/ResultsHelpText', () => ({
  ResultsHelpText: () => <div data-testid="results-help-text" />,
}));

jest.mock('@maps-react/common/components/Heading', () => ({
  H2: ({ children }: any) => <h2>{children}</h2>,
  H3: ({ children }: any) => <h3>{children}</h3>,
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

const queryParamsObj = { salary1: '50000' };

// Mock pieData for testing
const pieData = [
  { name: 'Take home', percentage: 24, colour: '#4CAF50' },
  { name: 'Deductions', percentage: 76, colour: '#F44336' },
];

describe('ResultsSingleTableSection', () => {
  it('renders main sections correctly', () => {
    render(
      <ResultsSingleTableSection
        resultsFrequency="yearly"
        setResultsFrequency={jest.fn()}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
        netAmount="12,000"
        frequencyText="a year"
        pieData={pieData}
        showBenefitsCallout={true}
      />,
    );

    // Headings
    expect(
      screen.getByText(/Your estimated take home pay/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/12,000/i)).toBeInTheDocument();
    // There may be multiple "a year" elements, so check that at least one exists
    expect(screen.getAllByText(/a year/i).length).toBeGreaterThan(0);

    // Pie chart legend
    // There are two "Take home" elements: one in the pie legend, one possibly elsewhere
    const takeHomeElements = screen.getAllByText(/Take home/i);
    expect(takeHomeElements.length).toBeGreaterThan(1); // Expect at least 2
    expect(screen.getAllByText(/Deductions/i).length).toBeGreaterThan(0);

    // Table
    expect(screen.getByTestId('results-table')).toBeInTheDocument();

    // Expandable section
    expect(screen.getByTestId('expandable-section')).toBeInTheDocument();

    // Benefits callout
    expect(
      screen.getByTestId(
        'callout-information-salary-calculator-benefits-callout',
      ),
    ).toBeInTheDocument();
  });

  it('calls setResultsFrequency on frequency change', () => {
    const setResultsFrequency = jest.fn();
    render(
      <ResultsSingleTableSection
        resultsFrequency="yearly"
        setResultsFrequency={setResultsFrequency}
        queryParamsObj={queryParamsObj}
        rows={mockRows}
        columns={mockColumns}
        netAmount="12,000"
        frequencyText="a year"
        pieData={pieData}
        showBenefitsCallout={true}
      />,
    );

    const selector = screen.getByTestId('frequency-selector');
    fireEvent.change(selector, { target: { value: 'monthly' } });
    expect(setResultsFrequency).toHaveBeenCalledWith('monthly');
  });
});
