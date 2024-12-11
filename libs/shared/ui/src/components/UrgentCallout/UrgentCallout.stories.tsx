import { StoryFn } from '@storybook/react';

import { UrgentCallout, UrgentCalloutProps } from '.';
import { Heading } from '../../components/Heading';

const StoryProps = {
  title: 'Components/COMMON/UrgentCallout',
  component: UrgentCallout,
};

const Template: StoryFn<UrgentCalloutProps> = (args) => (
  <UrgentCallout {...args} />
);

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

export const calculator = Template.bind({});
calculator.args = {
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

export const calculatorTeal = Template.bind({});
calculatorTeal.args = {
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

export default StoryProps;
