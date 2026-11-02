import { StoryFn } from '@storybook/nextjs';

import { Checkbox, CheckboxProps } from './Checkbox';

const StoryProps = {
  title: 'Components/TOOLS/Checkbox (Deprecated)',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          '⚠️ **DEPRECATED** — Use [CheckboxGroup](./?path=/docs/components-form-checkboxgroup--docs) instead. See the CheckboxGroup story for examples and migration guide.',
      },
    },
  },
};

const Template: StoryFn<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Checkbox',
  value: '',
  id: 'id-1',
  name: 'field-name',
};

export const Checked = Template.bind({});
Checked.args = {
  ...Default.args,
  defaultChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  hasError: true,
};

export const CheckedWithError = Template.bind({});
CheckedWithError.args = {
  ...Default.args,
  defaultChecked: true,
  hasError: true,
};

export const WithHint = Template.bind({});
WithHint.args = {
  ...Default.args,
  hint: 'This is a hint',
};

export default StoryProps;
