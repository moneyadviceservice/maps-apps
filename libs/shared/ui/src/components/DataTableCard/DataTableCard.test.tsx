import { render, screen } from '@testing-library/react';

import { DataTableCard } from '.';
import { expectTableWith } from '../Table/__tests__/utils';

describe('Table component', () => {
  const sampleTableData = {
    rows: [
      { cells: [{ data: 'Row 1, Value 1' }, { data: 'Row 1, Value 2' }] },
      { cells: [{ data: 'Row 2, Value 1' }, { data: 'Row 2, Value 2' }] },
    ],
  };

  const getElements = () => {
    return {
      titleEl: screen.queryByTestId('dtc-title'),
      descriptionEl: screen.queryByTestId('dtc-description'),
      tableEl: screen.getByTestId('dtc-table').querySelector('table'),
      footnoteEl: screen.queryByTestId('dtc-footnote'),
    };
  };

  it('Renders correctly with only required parameters', () => {
    render(<DataTableCard data={sampleTableData} />);

    const { titleEl, descriptionEl, tableEl, footnoteEl } = getElements();

    expect(titleEl).toBeNull();
    expect(descriptionEl).toBeNull();
    expectTableWith({ tableEl, data: sampleTableData });
    expect(footnoteEl).toBeNull();
  });

  it('Renders correctly fixed layout', () => {
    render(<DataTableCard tableLayout="fixed" data={sampleTableData} />);

    const { titleEl, descriptionEl, tableEl, footnoteEl } = getElements();

    expect(titleEl).toBeNull();
    expect(descriptionEl).toBeNull();
    expectTableWith({ tableEl, layout: 'fixed', data: sampleTableData });
    expect(footnoteEl).toBeNull();
  });

  it('Renders correctly with title', () => {
    render(<DataTableCard title="Sample Title" data={sampleTableData} />);

    const { titleEl, descriptionEl, tableEl, footnoteEl } = getElements();

    expect(titleEl).toBeDefined();
    expect(titleEl).toHaveTextContent('Sample Title');
    expect(descriptionEl).toBeNull();
    expectTableWith({ tableEl, data: sampleTableData });
    expect(footnoteEl).toBeNull();
  });

  it('Renders correctly with description', () => {
    render(
      <DataTableCard description="Sample description" data={sampleTableData} />,
    );

    const { titleEl, descriptionEl, tableEl, footnoteEl } = getElements();

    expect(titleEl).toBeNull();
    expect(descriptionEl).toHaveTextContent('Sample description');
    expectTableWith({ tableEl, data: sampleTableData });
    expect(footnoteEl).toBeNull();
  });

  it('Renders correctly with footnote', () => {
    render(<DataTableCard footnote="Sample footnote" data={sampleTableData} />);

    const { titleEl, descriptionEl, tableEl, footnoteEl } = getElements();

    expect(titleEl).toBeNull();
    expect(descriptionEl).toBeNull();
    expectTableWith({ tableEl, data: sampleTableData });
    expect(footnoteEl).toHaveTextContent('Sample footnote');
  });

  it('Renders correctly with table column headings', () => {
    render(
      <DataTableCard
        columnHeadings={['Column1', 'Column2']}
        data={sampleTableData}
      />,
    );

    const { titleEl, descriptionEl, tableEl, footnoteEl } = getElements();

    expect(titleEl).toBeNull();
    expect(descriptionEl).toBeNull();
    expectTableWith({
      tableEl,
      columnHeadings: ['Column1', 'Column2'],
      data: sampleTableData,
    });
    expect(footnoteEl).toBeNull();
  });
});
