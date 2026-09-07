import { StoryFn } from '@storybook/nextjs';

import { Props, TabLayout } from '.';

const StoryProps = {
  title: 'Layouts/PENSION-TOOLS/TabLayout',
  component: TabLayout,
};

const Template: StoryFn<Props> = (args) => <TabLayout {...args} />;

export const Default = Template.bind({});
Default.args = {
  tabLinks: ['Navigation Tab 1', 'Navigation Tab 2', 'Navigation Tab 3'],
  tabContent: [
    <>Hello World Content 1</>,
    <>Hello World Content 2</>,
    <>Hello World Content 3</>,
  ],
  currentTab: 1,
  tabHeadings: ['Heading 1', 'Heading 2', 'Heading 3'],
  toolBaseUrl: '/example',
  hasErrors: false,
};

export default StoryProps;
