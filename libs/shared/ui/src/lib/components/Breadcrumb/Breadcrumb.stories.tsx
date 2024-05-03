import { StoryFn } from '@storybook/react';
import { Breadcrumb, BreadcrumbProps } from '.';

const StoryProps = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
};

const Template: StoryFn<BreadcrumbProps> = (args) => <Breadcrumb {...args} />;

export const Default = Template.bind({});
Default.args = {
  crumbs: [
    {
      label: 'Crumb 1',
      link: 'https://www.moneyhelper.org.uk/en',
    },
    {
      label: 'Crumb 2',
      link: 'https://www.moneyhelper.org.uk/en',
    },
  ],
};

export default StoryProps;
