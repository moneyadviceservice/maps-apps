import type {
  PensionChannel,
  UnavailableAccruedAmountReason,
  UnavailableERIReason,
} from './types';

type ReplaceInUnion<T, From, To> = T extends From ? To : T;

// For easy configuration.
type Row = ReplaceInUnion<UnavailableAccruedAmountReason, '', 'None'>;
type Column = ReplaceInUnion<UnavailableERIReason, '', 'None'>;

type MatrixInput = Record<Row, Record<Column, PensionChannel>>;

export class ClassificationMatrix {
  private rows: Row[] = [
    'None',
    'ANO',
    'DBC',
    'DCC',
    'MEM',
    'NET',
    'NEW',
    'PPF',
    'TRN',
    'WU',
  ];
  private cols: Column[] = [
    'None',
    'ANO',
    'DB',
    'DBC',
    'DCC',
    'DCHA',
    'DCHP',
    'MEM',
    'NET',
    'NEW',
    'PPF',
    'TRN',
    'WU',
  ];

  private matrix: Partial<Record<Row, Record<Column, PensionChannel>>> = {};
  private currentRow: Row | null = null;

  constructor(initialData?: MatrixInput) {
    // Initialize matrix
    for (const row of this.rows) {
      this.matrix[row] = {} as Record<Column, PensionChannel>;
      for (const col of this.cols) {
        this.matrix[row][col] = null;
      }
    }

    // Merge in provided data
    if (initialData) {
      for (const row in initialData) {
        const rowLabel = row as Row;
        const cols = initialData[rowLabel];
        if (!cols) continue;
        for (const col in cols) {
          const colLabel = col as Column;
          const value = cols[colLabel];
          if (value) this.set(rowLabel, colLabel, value);
        }
      }
    }
  }

  /** Set a cell value */
  set(row: Row, col: Column, value: PensionChannel): this {
    this.validate(row, col, value);
    this.matrix[row][col] = value;
    return this;
  }

  /** Chainable row selector */
  accuredAmountCode(label: Row): this {
    if (!this.rows.includes(label))
      throw new Error(`Invalid row label: ${label}`);
    this.currentRow = label;
    return this;
  }

  /** Chainable column lookup */
  eriAmountCode(label: Column): PensionChannel {
    if (!this.cols.includes(label))
      throw new Error(`Invalid column label: ${label}`);
    if (!this.currentRow)
      throw new Error(
        `You must call .accuredAmountCode(label) before .eriAmountCode(label)`,
      );

    const value = this.matrix[this.currentRow][label];
    this.currentRow = null;
    return value;
  }

  private validate(row: Row, col: Column, value?: PensionChannel) {
    if (!this.rows.includes(row)) throw new Error(`Invalid row: ${row}`);
    if (!this.cols.includes(col)) throw new Error(`Invalid col: ${col}`);
    if (value && !['RED', 'GREEN', 'YELLOW', null].includes(value))
      throw new Error(`Invalid value: ${value}`);
  }
}
