import React from 'react';

import { LAYOUT, ROWS_PER_PAGE, styles } from './config';
import { chunkRows, ExportPDF } from './ExportPDF';

jest.mock('@react-pdf/renderer', () => {
  const React = require('react');
  return {
    Document: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', null, children),
    Page: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', null, children),
    View: ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', null, children),
    Text: () => React.createElement('span', null),
    Image: () => React.createElement('img', null),
    StyleSheet: {
      create: <T extends Record<string, unknown>>(obj: T): T => obj,
    },
  };
});

const defaultColumnHeaders = {
  name: 'Name',
  website: 'Website',
  phone: 'Phone',
  email: 'Email',
};

function makeRows(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    name: `Firm ${i + 1}`,
    website: `https://firm-${i + 1}.example`,
    phone: '',
    email: '',
  }));
}

describe('ExportPDF', () => {
  describe('layout styles (centering, decoration band, no header text)', () => {
    it('content area has equal left and right margins (centered grey block)', () => {
      expect(styles.contentArea.marginLeft).toBe(LAYOUT.PAGE_MARGIN_H);
      expect(styles.contentArea.marginRight).toBe(LAYOUT.PAGE_MARGIN_H);
    });

    it('decoration spans from content band top to footer (multi-page same height as grey band)', () => {
      expect(styles.decoration.position).toBe('absolute');
      expect(styles.decoration.top).toBe(LAYOUT.CONTENT_BAND_TOP);
      expect(styles.decoration.bottom).toBe(LAYOUT.FOOTER_HEIGHT);
      expect(styles.decoration.right).toBe(-40);
      expect(styles.decoration.width).toBe(140);
    });

    it('does not define unused header text styles (logo only)', () => {
      expect(styles).not.toHaveProperty('headerTextBlock');
      expect(styles).not.toHaveProperty('headerTextLine1');
      expect(styles).not.toHaveProperty('headerTextLine2');
    });
  });

  it('renders without throwing', () => {
    expect(() =>
      ExportPDF({
        title: 'Test',
        columnHeaders: {
          name: 'Name',
          website: 'Website',
          phone: 'Phone',
          email: 'Email',
        },
        rows: [
          {
            name: 'Firm A',
            website: 'https://a.example',
            phone: '',
            email: '',
          },
        ],
      }),
    ).not.toThrow();
  });

  it('renders exactly one page when 13 rows (avoids empty second page)', () => {
    const doc = ExportPDF({
      title: 'Test',
      columnHeaders: defaultColumnHeaders,
      rows: makeRows(13),
    });
    expect(React.Children.count(doc.props.children)).toBe(1);
  });

  it('renders two pages when row count exceeds ROWS_PER_PAGE', () => {
    const rowCount = ROWS_PER_PAGE + 3;
    const doc = ExportPDF({
      title: 'Test',
      columnHeaders: defaultColumnHeaders,
      rows: makeRows(rowCount),
    });
    expect(React.Children.count(doc.props.children)).toBe(2);
  });

  describe('chunkRows', () => {
    it('does not push empty chunks when size is 0 (covers guard branch)', () => {
      const rows = makeRows(3);
      expect(chunkRows(rows, 0)).toEqual([]);
    });
  });
});
