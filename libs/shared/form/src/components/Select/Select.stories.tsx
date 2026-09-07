import { StoryFn } from '@storybook/nextjs';

import { Props, Select } from './Select';

const StoryProps = {
  title: 'Components/FORM/Select',
  component: Select,
  tags: ['molecule'],
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zOXKbKzt2dhBi1ZOauyUKA/Component-Library---BETA---WIP-?node-id=5463-32315&m=dev',
    },
    docs: {
      description: {
        component: `
This component renders a dropdown select field for form submissions. Options are controlled via an array of type \`Options[]\`.

\`\`\`ts
interface Options {
  text: ReactNode;
  value: string;
}
\`\`\`

The component supports optional label rendering, an optional empty/placeholder option, and error messaging with visual error states. The placeholder option can be hidden from the dropdown while still remaining selectable.

**Used Components:**
- [Icon](?path=/story/components-common-icon--docs)
- [Paragraph](?path=/story/components-common-paragraph--docs)
- [Errors](?path=/story/components-common-errors--docs)
        `,
      },
    },
  },
};

const Template: StoryFn<Props> = (args) => <Select {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'name1',
  label: 'Label',
  options: [
    { text: 'Item 1', value: 'value1' },
    { text: 'Item 2', value: 'value2' },
    { text: 'Item 3', value: 'value3' },
  ],
};

export const WithEmptyItemText = Template.bind({});
WithEmptyItemText.args = {
  ...Default.args,
  emptyItemText: 'Empty Item Text',
};

export const HideEmptyItemText = Template.bind({});
HideEmptyItemText.args = {
  ...Default.args,
  hideEmptyItem: true,
};

export const HidePlaceholder = Template.bind({});
HidePlaceholder.args = {
  ...Default.args,
  hidePlaceholder: true,
};

export const WithDefaultValue = Template.bind({});
WithDefaultValue.args = {
  ...Default.args,
  emptyItemText: 'Empty Item Text',
  defaultValue: 'value2',
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  hasError: true,
  error: 'Please select an item',
};

export const WithErrorWrapper = Template.bind({});
WithErrorWrapper.args = {
  ...Default.args,
  hasErrorWrapper: true,
  hasError: true,
  error: 'Please select an item',
};

export default StoryProps;
