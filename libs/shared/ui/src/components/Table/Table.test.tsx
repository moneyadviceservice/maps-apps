import React from 'react';

import { render } from '@testing-library/react';

import { Table } from './Table';

describe('Table component', () => {
  const sampleData = [
    ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
    ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
    ['Row 3, Col 1', 'Row 3, Col 2', 'Row 3, Col 3'],
  ];

  it('renders correctly with title and data', () => {
    const { container } = render(
      <Table
        title="Sample Table"
        columnHeadings={['Column 1', 'Column 2', 'Column 3']}
        data={sampleData}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly without title', () => {
    const { container } = render(
      <Table
        columnHeadings={['Column 1', 'Column 2', 'Column 3']}
        data={sampleData}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly without headings', () => {
    const { container } = render(<Table data={sampleData} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders correctly as numeric variant', () => {
    const { container } = render(<Table data={sampleData} variant="numeric" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders an empty table correctly', () => {
    const { container } = render(<Table columnHeadings={[]} data={[]} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
