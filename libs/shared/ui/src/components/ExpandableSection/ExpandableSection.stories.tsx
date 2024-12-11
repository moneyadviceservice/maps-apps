import { StoryFn } from '@storybook/react';

import { ExpandableSection, ExpandableSectionProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/ExpandableSection',
  component: ExpandableSection,
};

const Template: StoryFn<ExpandableSectionProps> = (args: any) => (
  <ExpandableSection {...args} />
);

export const Hyperlink = Template.bind({});
Hyperlink.args = {
  title: 'This is an expandable section',
  children: <div>Some content goes here</div>,
};

export const HyperlinkOpen = Template.bind({});
HyperlinkOpen.args = {
  title: 'This is an expandable section',
  children: <div>Some content goes here</div>,
  open: true,
};

export const Main = Template.bind({});
Main.args = {
  title: 'This is an expandable section secondary variant',
  variant: 'main',
  children: (
    <div>
      Credit cards are a secure, flexible way to pay and can help spread the
      cost of major purchases. But taking out more credit than you can afford or
      only making minimum payments can be costly and lead to increased debt.
    </div>
  ),
};

export const MainOpen = Template.bind({});
MainOpen.args = {
  title: 'This is an expandable section secondary variant',
  variant: 'main',
  children: (
    <div>
      Credit cards are a secure, flexible way to pay and can help spread the
      cost of major purchases. But taking out more credit than you can afford or
      only making minimum payments can be costly and lead to increased debt.
    </div>
  ),
  open: true,
};

export const MainLeftIcon = Template.bind({});
MainLeftIcon.args = {
  title:
    'This is an expandable section secondary variant with the chevron on the left',
  variant: 'mainLeftIcon',
  children: (
    <div>
      Credit cards are a secure, flexible way to pay and can help spread the
      cost of major purchases. But taking out more credit than you can afford or
      only making minimum payments can be costly and lead to increased debt.
    </div>
  ),
};

export const MainLeftIconOpen = Template.bind({});
MainLeftIconOpen.args = {
  title:
    'This is an expandable section secondary variant with the chevron on the left',
  variant: 'mainLeftIcon',
  children: (
    <div>
      Credit cards are a secure, flexible way to pay and can help spread the
      cost of major purchases. But taking out more credit than you can afford or
      only making minimum payments can be costly and lead to increased debt.
    </div>
  ),
  open: true,
};

export default StoryProps;
