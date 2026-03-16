import { StoryFn } from '@storybook/nextjs';

import { Props, TextArea } from '.';

const StoryProps = {
  title: 'Components/FORM/TextArea',
  component: TextArea,
};

const Template: StoryFn<Props> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'default-id',
  label: 'Text Area',
};

export const WithError = Template.bind({});
WithError.args = {
  id: 'error id',
  label: 'Text Area',
  error: 'This is an error message',
};
export const WithHint = Template.bind({});
WithHint.args = {
  id: 'hint id',
  label: 'Text Area',
  hint: 'This is a hint message',
};
export const WithErrorAndHint = Template.bind({});
WithErrorAndHint.args = {
  id: 'error and hint id',
  label: 'Text Area',
  error: 'This is an error message',
  hint: 'This is a hint message',
};
export const WithCharacterCount = Template.bind({});
WithCharacterCount.args = {
  id: 'character count id',
  label: 'Text Area',
  hasCharacterCounter: true,
  maxLength: 4000,
};

export const WithDefaultValueAndCounter = Template.bind({});
WithDefaultValueAndCounter.args = {
  id: 'default-value-text-area',
  label: 'Text Area with Default Value and Counter',
  hasCharacterCounter: true,
  maxLength: 4000,
  defaultValue: 'This is a default value.',
};

export const WithMarkdownLabel = Template.bind({});
WithMarkdownLabel.args = {
  id: 'markdown-label-text-area',
  label: (
    <span>
      Your <strong>bold</strong> label with <em>emphasis</em>
    </span>
  ),
  hint: 'This demonstrates that label accepts ReactNode, not just strings',
  maxLength: 500,
  hasCharacterCounter: true,
};

export default StoryProps;
