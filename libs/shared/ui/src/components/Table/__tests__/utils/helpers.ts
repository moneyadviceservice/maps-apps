import { expect } from '@jest/globals';

import '@testing-library/jest-dom';

// Test helper for checking table contents when using structured data
export const expectTableWith = ({
  tableEl,
  columnHeadings,
  data,
  layout = 'auto',
}: {
  tableEl: HTMLTableElement | null;
  data: {
    rows: {
      cells: { data: string; isHeading?: boolean; className?: string }[];
    }[];
  };
  columnHeadings?: string[];
  layout?: 'fixed' | 'auto';
}) => {
  expect(tableEl).toBeDefined();
  expect(tableEl).toHaveClass(`table-${layout}`);

  if (columnHeadings) {
    const headerEl = tableEl?.querySelector('thead');
    expect(headerEl).toBeDefined();

    const columnHeadingEls = headerEl?.querySelectorAll('th');
    expect(columnHeadingEls).toHaveLength(columnHeadings.length);
    columnHeadingEls?.forEach((columnHeadingEl, idx) => {
      expect(columnHeadingEl.textContent).toStrictEqual(columnHeadings[idx]);
    });
  }

  const bodyEl = tableEl?.querySelector('tbody');
  expect(bodyEl).toBeDefined();

  const rowEls = bodyEl?.querySelectorAll('tr');
  expect(rowEls).toHaveLength(data.rows.length);
  data.rows.forEach((row, rowIdx) => {
    const rowEl = rowEls?.[rowIdx];
    const cellEls = rowEl?.querySelectorAll('th,td');

    expect(cellEls).toHaveLength(row.cells.length);
    row.cells.forEach((cell, cellIdx) => {
      const cellEl = cellEls?.[cellIdx];

      if (cell.isHeading) {
        expect(cellEl?.tagName).toStrictEqual('TH');
      } else {
        expect(cellEl?.tagName).toStrictEqual('TD');
      }

      if (cell.className) {
        expect(cellEl).toHaveClass(cell.className);
      }
      expect(cellEl).toHaveTextContent(cell.data);
    });
  });
};
