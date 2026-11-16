import { ReactNode } from 'react';

import { Heading } from '../Heading';
import { Paragraph } from '../Paragraph';
import { Table, TableData } from '../Table';

export type Props = {
  title?: string;
  description?: ReactNode;
  tableLayout?: 'auto' | 'fixed';
  columnHeadings?: string[];
  data: TableData;
  footnote?: ReactNode;
};

export const DataTableCard = ({
  title,
  description,
  tableLayout = 'auto',
  columnHeadings,
  data,
  footnote,
}: Props) => {
  return (
    <div
      data-testid="dtc"
      className="grid bg-gray-95 p-4 lg:px-6 lg:pt-6 lg:pb-[40px] gap-4"
    >
      {title && (
        <Heading
          data-testid="dtc-title"
          className="text-blue-700 lg:text-gray-800 pb-2 lg:pb-4"
          level="h3"
        >
          {title}
        </Heading>
      )}
      {description && (
        <Paragraph data-testid="dtc-description" className="pb-2 mb-0">
          {description}
        </Paragraph>
      )}
      <div data-testid="dtc-table">
        <Table
          className="py-0"
          layout={tableLayout}
          columnHeadings={columnHeadings}
          data={data}
        />
      </div>
      {footnote && <div data-testid="dtc-footnote">{footnote}</div>}
    </div>
  );
};
