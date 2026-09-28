import { createElement } from 'react';

import { StoryFn } from '@storybook/nextjs';

import { TabLink, tabListItemClasses } from './TabLink';

const exampleTabArgs = {
  label: 'Example tab',
  href: '/en/pension-details/pension-income-and-values?focus=details-heading',
  testId: 'tab-pension-income-and-values',
  isActive: false,
};

const StoryProps = {
  title: 'Components/MHPD/TabLink',
  component: TabLink,
};

const Template: StoryFn<typeof TabLink> = (args) =>
  createElement(
    'ul',
    null,
    createElement(
      'li',
      { className: tabListItemClasses },
      createElement(TabLink, args),
    ),
  );

export const Default = Template.bind({});
Default.args = exampleTabArgs;

export const Selected = Template.bind({});
Selected.storyName = 'State: Selected';
Selected.args = {
  ...exampleTabArgs,
  isActive: true,
};

export const Hover = Template.bind({});
Hover.storyName = 'State: Hover';
Hover.args = exampleTabArgs;
Hover.parameters = {
  pseudo: {
    hover: true,
  },
};

export const Active = Template.bind({});
Active.storyName = 'State: Active';
Active.args = exampleTabArgs;
Active.parameters = {
  pseudo: {
    active: true,
  },
};

export const Focus = Template.bind({});
Focus.storyName = 'State: Focus';
Focus.args = exampleTabArgs;
Focus.parameters = {
  pseudo: {
    focusVisible: true,
  },
};

export default StoryProps;
