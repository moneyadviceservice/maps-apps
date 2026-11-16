import React from 'react';

import {
  decorationLogoDataUrl,
  headerLogoDataUrl,
} from 'data/components/exportPdf/pdfLogoDataUrls';
import { Document, Image, Page, Text, View } from '@react-pdf/renderer';

import type { FirmExportRow } from './utils/firmToExportRow';
import { FOOTER_LINES, FOOTER_TITLE, ROWS_PER_PAGE, styles } from './config';

/** Split rows into non-empty chunks of up to `size`. Exported for tests. */
export function chunkRows<T>(rows: readonly T[], size: number): T[][] {
  const chunks: T[][] = [];
  const step = Math.max(1, size);
  for (let i = 0; i < rows.length; i += step) {
    const chunk = rows.slice(i, i + size);
    if (chunk.length > 0) chunks.push(chunk);
  }
  return chunks;
}

export type ExportPDFProps = {
  readonly title: string;
  readonly columnHeaders: {
    readonly name: string;
    readonly website: string;
    readonly phone: string;
    readonly email: string;
  };
  readonly rows: readonly FirmExportRow[];
};

export function ExportPDF({ title, columnHeaders, rows }: ExportPDFProps) {
  const pageChunks = chunkRows(rows, ROWS_PER_PAGE);

  return (
    <Document title={title}>
      {pageChunks.map((pageRows, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          orientation="landscape"
          style={styles.page}
        >
          <View style={styles.header} fixed>
            <Image src={headerLogoDataUrl} style={styles.headerLogo} />
          </View>
          <View style={styles.contentBackground} fixed />
          <View style={styles.contentArea}>
            <View style={styles.table}>
              <View style={styles.headerRow} fixed>
                <Text style={styles.cellName}>{columnHeaders.name}</Text>
                <Text style={styles.cellWebsite}>{columnHeaders.website}</Text>
                <Text style={styles.cellPhone}>{columnHeaders.phone}</Text>
                <Text style={styles.cellEmail}>{columnHeaders.email}</Text>
              </View>
              {pageRows.map((row, index) => (
                <View
                  key={`${row.name}-${pageIndex}-${index}`}
                  style={styles.row}
                >
                  <Text style={styles.cellName}>{row.name}</Text>
                  <Text style={styles.cellWebsite}>{row.website}</Text>
                  <Text style={styles.cellPhone}>{row.phone}</Text>
                  <Text style={styles.cellEmail}>{row.email}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footerTextFirstLine}>{FOOTER_TITLE}</Text>
            <Text style={[styles.footerText, styles.footerTextBlock]}>
              {FOOTER_LINES.join('\n')}
            </Text>
          </View>
          <View fixed>
            <View style={styles.decoration}>
              <Image
                src={decorationLogoDataUrl}
                style={styles.decorationImage}
              />
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}
