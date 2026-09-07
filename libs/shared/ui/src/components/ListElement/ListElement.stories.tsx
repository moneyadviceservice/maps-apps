import { JSX, ReactNode } from 'react';

import { StoryFn } from '@storybook/nextjs';

import { ListElement, ListElementProps } from '.';

const StoryProps = {
  title: 'Components/COMMON/ListElement',
  component: ListElement,
};

const Template: StoryFn<ListElementProps> = (
  args: JSX.IntrinsicAttributes & ListElementProps,
) => <ListElement {...args} />;

const Content: ReactNode[] = [
  <p key={1}>First line</p>,
  <p key={2}>Second Line</p>,
  <p key={3}>Third Line</p>,
];

export const Default = Template.bind({});

Default.args = {
  color: 'magenta',
  variant: 'unordered',
  items: Content,
};

export const DarkStyleUL = Template.bind({});

DarkStyleUL.args = {
  color: 'dark',
  variant: 'unordered',
  items: Content,
};

export const BlueStyleUL = Template.bind({});

BlueStyleUL.args = {
  color: 'blue',
  variant: 'unordered',
  items: Content,
};

export const Decimal = Template.bind({});

Decimal.args = {
  color: 'magenta',
  variant: 'ordered',
  items: Content,
};

export const DarkStyleOL = Template.bind({});

DarkStyleOL.args = {
  color: 'dark',
  variant: 'ordered',
  items: Content,
};

export const BlueStyleOL = Template.bind({});

BlueStyleOL.args = {
  color: 'blue',
  variant: 'ordered',
  items: Content,
};

export const NestedUList = Template.bind({});

NestedUList.args = {
  color: 'blue',
  variant: 'unordered',
  items: [
    'Simple list item',
    {
      content: 'Nested list item',
      sublist: {
        variant: 'unordered',
        items: ['Nested list item 1', 'Nested list item 2'],
      },
    },
  ],
};

export default StoryProps;
