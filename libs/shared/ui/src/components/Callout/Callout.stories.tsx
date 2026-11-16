import { StoryFn } from '@storybook/nextjs';

import { Callout, CalloutProps } from '.';
import { Heading } from '../Heading';

const StoryProps = {
  title: 'Components/COMMON/Callout',
  component: Callout,
};

const Template: StoryFn<CalloutProps> = (args) => <Callout {...args} />;

const children = (
  <div className="ml-3 -mt-3 space-y-3">
    <Heading level="h5">Todo list</Heading>
    <ul>
      <li>item</li>
      <li>item</li>
      <li>item</li>
    </ul>
  </div>
);

export const Arrow = Template.bind({});
Arrow.args = {
  children,
  variant: 'arrow',
};

export const Calculator = Template.bind({});
Calculator.args = {
  children,
  variant: 'calculator',
};

export const Warning = Template.bind({});
Warning.args = {
  children,
  variant: 'warning',
};

export const ArrowTeal = Template.bind({});
ArrowTeal.args = {
  children,
  variant: 'arrow',
  border: 'teal',
};

export const CalculatorTeal = Template.bind({});
CalculatorTeal.args = {
  children,
  variant: 'calculator',
  border: 'teal',
};

export const WarningTeal = Template.bind({});
WarningTeal.args = {
  children,
  variant: 'warning',
  border: 'teal',
};

const noIconChildren = (
  <div className="space-y-4">
    <Heading level="h2" className="mt-0 text-blue-700">
      We&apos;ve set your target retirement income as £18,000
    </Heading>
    <p>
      It&apos;s calculated based on government research into retirement income
      needs.
    </p>
  </div>
);

export const WarningTealNoIcon = Template.bind({});
WarningTealNoIcon.storyName = 'Warning teal, no icon';
WarningTealNoIcon.parameters = {
  docs: {
    description: {
      story:
        'The pension calculator target income design uses the warning frame with a teal border and no icon. That frame is an 8px border, smaller than the mortgage variant’s 16px border.',
    },
  },
};
WarningTealNoIcon.args = {
  children: noIconChildren,
  variant: 'warning',
  border: 'teal',
  hideIcon: true,
};

export const Mortgage = Template.bind({});
Mortgage.args = {
  children,
  variant: 'mortgage',
};

export default StoryProps;
