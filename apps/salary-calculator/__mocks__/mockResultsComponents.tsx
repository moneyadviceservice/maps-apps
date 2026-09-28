import React from 'react';

import { FrequencyType } from 'components/ResultsTable';

export const mockZ = (translations: any) => translations.en;

// ----- Frequency Selector -----
interface MockFrequencySelectorProps {
  currentFrequency: FrequencyType;
  onFrequencyChange: (frequency: FrequencyType) => void;
}

export const MockFrequencySelector = ({
  currentFrequency,
  onFrequencyChange,
}: MockFrequencySelectorProps) => (
  <div>
    <select
      data-testid="frequency-selector"
      value={currentFrequency}
      onChange={(e) => onFrequencyChange(e.target.value as FrequencyType)}
    >
      <option value="yearly">Yearly</option>
      <option value="monthly">Monthly</option>
      <option value="weekly">Weekly</option>
    </select>
    <span data-testid="current-frequency">{currentFrequency}</span>
  </div>
);
// ----- Results Table -----
interface TableRow {
  label: { en: string; cy?: string };
  value?: string | number;
  [key: string]: unknown;
}

interface MockResultsTableProps {
  rows: TableRow[];
  columns: { [key: string]: unknown }[];
  frequency: FrequencyType;
}

export const MockResultsTableBase = ({
  rows,
  columns,
  frequency,
}: MockResultsTableProps) => (
  <div data-testid="results-table">
    <div data-testid="table-frequency">{frequency}</div>
    <div data-testid="table-rows">{rows.length}</div>
    <div data-testid="table-columns">{columns.length}</div>
  </div>
);

export const MockResultsTableWithRows = ({
  rows,
  columns,
  frequency,
}: MockResultsTableProps) => (
  <div data-testid="results-table">
    <div data-testid="table-frequency">{frequency}</div>
    <div data-testid="table-rows">{rows.length}</div>
    <div data-testid="table-columns">{columns.length}</div>

    {rows.map((row, idx: number) => (
      <div key={idx}>
        {row.label.en}
        {row.label.en === 'Student Loan' && (
          <span>{row.value ?? '142.00'}</span>
        )}
      </div>
    ))}
  </div>
);

// ----- PieChart -----
interface MockPieChartProps {
  items: { name: string; percentage: number; colour: string }[];
}

export const MockPieChart = ({ items }: MockPieChartProps) => (
  <div data-testid="pie-chart">
    {items.map((i) => (
      <div key={i.name}>
        {i.name}: {i.percentage}%
      </div>
    ))}
  </div>
);

// ----- Benefits Callout -----
interface MockBenefitsCalloutProps {
  children?: React.ReactNode;
}

export const MockBenefitsCallout = ({ children }: MockBenefitsCalloutProps) => (
  <div data-testid="benefits-callout">{children}</div>
);

// ----- Results Help Text -----
export const MockResultsHelpText = () => (
  <div data-testid="results-help-text">Help text</div>
);

// ----- Expandable Section -----
export const MockExpandableSection = ({ title, children }: any) => (
  <div data-testid="expandable-section">
    <h3>{typeof title === 'object' ? mockZ(title) : title}</h3>
    {children}
  </div>
);

// ----- List Element -----
export const MockListElement = ({ items }: any) => (
  <ul data-testid="list-element">
    {items.map((i: string, idx: number) => (
      <li key={idx}>{i}</li>
    ))}
  </ul>
);

// ----- Paragraph -----
export const MockParagraph = ({ children }: any) => <p>{children}</p>;
