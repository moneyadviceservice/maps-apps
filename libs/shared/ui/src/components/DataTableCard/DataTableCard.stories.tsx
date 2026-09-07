import { StoryFn } from '@storybook/nextjs';

import { DataTableCard, DataTableProps } from '.';
import { Icon, IconType } from '../Icon';
import { Paragraph } from '../Paragraph';

const StoryProps = {
  title: 'Components/COMMON/DataTableCard',
  component: DataTableCard,
};

const Template: StoryFn<DataTableProps> = (args) => <DataTableCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'DataTableCard title',
  description: 'DataTableCard description',
  footnote: 'DataTableCard footnote',
  data: {
    rows: [
      {
        cells: [
          { data: 'Row 1', isHeading: true },
          { data: 'Value 1', className: 'font-bold' },
        ],
      },
      { cells: [{ data: 'Row 2', isHeading: true }, { data: 'Value 2' }] },
    ],
  },
};

export const ColumnHeadings = Template.bind({});
ColumnHeadings.args = {
  title: 'DataTableCard title',
  description: 'DataTableCard description',
  footnote: (
    <span className="flex flex-row gap-4">
      <Icon type={IconType.PIGGY_BANK} />
      <Paragraph>DataTableCard footnote</Paragraph>
    </span>
  ),
  columnHeadings: ['Column 1', 'Column 2', 'Column 3'],
  data: {
    rows: [
      {
        cells: [
          { data: 'Row 1, Value 1' },
          {
            data: (
              <>
                Row 1, <span className="text-blue-700">Value 2</span>
              </>
            ),
            className: 'font-bold',
          },
          { data: 'Row 1, Value 3' },
        ],
      },
      {
        cells: [
          { data: 'Row 2, Value 1' },
          { data: 'Row 2, Value 2', className: 'font-bold' },
          { data: 'Row 2, Value 3' },
        ],
      },
    ],
  },
};

export const SimpleData = Template.bind({});
SimpleData.args = {
  title: 'DataTableCard title',
  description: 'DataTableCard description',
  columnHeadings: ['Column 1', 'Column 2', 'Column 3'],
  data: [
    ['Row 1, Value 1', 'Row 1, Value 2', 'Row 1, Value 3'],
    ['Row 2, Value 1', 'Row 2, Value 2', 'Row 2, Value 3'],
  ],
};

export default StoryProps;
