import { StoryFn } from '@storybook/react';

import { Breadcrumb, BreadcrumbProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/Breadcrumb',
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

export const Themed = Template.bind({});
Themed.args = {
  classes: ['[&_a]:text-blue-600 [&_p]:text-blue-600 [&_path]:fill-blue-600'],
  crumbs: [
    {
      label: 'Crumb 1',
      link: 'link-to-1',
    },
    {
      label: 'Crumb 2',
      link: 'link-to-2',
    },
  ],
};

export const TripleBreadcrumb = Template.bind({});
TripleBreadcrumb.args = {
  crumbs: [
    {
      label: 'Crumb 1',
      link: 'link-to-1',
    },
    {
      label: 'Crumb 2',
      link: 'link-to-2',
    },
    {
      label: 'Crumb 3',
      link: 'link-to-3',
    },
  ],
};

export default StoryProps;
