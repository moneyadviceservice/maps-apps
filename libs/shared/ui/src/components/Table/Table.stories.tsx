import { StoryFn } from '@storybook/nextjs';

import { Table } from './Table';

const StoryProps = {
  title: 'Components/COMMON/Table',
  component: Table,
};

const Template: StoryFn<typeof Table> = (args) => (
  <div className="p-4">
    <Table {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: 'Sample Table',
  columnHeadings: ['Column 1', 'Column 2', 'Column 3'],
  data: [
    ['Row 1, Col 1', 'Row 1, Col 2', 'Row 1, Col 3'],
    ['Row 2, Col 1', 'Row 2, Col 2', 'Row 2, Col 3'],
    ['Row 3, Col 1', 'Row 3, Col 2', 'Row 3, Col 3'],
  ],
};

export const WithCustomTitle = Template.bind({});
WithCustomTitle.args = {
  ...Default.args,
  title: 'Custom Title',
};

export const NoTitle = Template.bind({});
NoTitle.args = {
  ...Default.args,
  title: undefined,
};

export const NumericTable = Template.bind({});
NumericTable.args = {
  variant: 'numeric',
  columnHeadings: ['Year', 'Remaining Debt'],
  data: [
    ['Year 0', '£95,000'],
    ['Year 1', '£93,111'],
    ['Year 2', '£91,121'],
    ['Year 3', '£89,023'],
    ['Year 4', '£86,813'],
    ['Year 5', '£84,483'],
    ['Year 10', '£70,817'],
    ['Year 15', '£53,060'],
    ['Year 20', '£29,985'],
    ['Year 25', '£0'],
  ],
};
export const EmptyTable = Template.bind({});
EmptyTable.args = {
  title: 'Empty Table',
  columnHeadings: [],
  data: [],
};

export default StoryProps;
