import { StoryFn } from '@storybook/nextjs';

import { Props, TextArea } from '.';

const StoryProps = {
  title: 'Components/FORM/TextArea',
  component: TextArea,
  tags: ['molecule'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zOXKbKzt2dhBi1ZOauyUKA/Component-Library---BETA---WIP-?node-id=5464-37024&m=dev',
    },
    docs: {
      description: {
        component: `
This component renders a multi-line text area for form submissions. It supports label content as text or ReactNode (label is required for accessibility), optional hint text, error messaging, and a live character counter via \`maxLength\`.

The \`hideLabel\` prop visually hides the label but keeps it accessible for screen readers.

Error handling:
- The \`error\` prop displays an error message below the field.
- The \`hasErrorWrapper\` prop wraps the field in the [Errors](?path=/story/components-common-errors--docs) component, enabling error summary integration and improved accessibility.

Accessibility features include label association, error state semantics, and \`aria-describedby\` linkage for hint, error, and counter content.

**Used Components:**
- [Paragraph](?path=/docs/components-common-paragraph--docs)
- [Errors](?path=/docs/components-common-errors--docs)
        `,
      },
    },
  },
};

const Template: StoryFn<Props> = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'default-id',
  label: 'Label',
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  id: 'with-error-id',
  error: 'Error: message goes here',
};
export const WithHint = Template.bind({});
WithHint.args = {
  ...Default.args,
  id: 'with-hint-id',
  hint: 'Hint label',
};
export const WithErrorAndHint = Template.bind({});
WithErrorAndHint.args = {
  ...WithError.args,
  ...WithHint.args,
  id: 'with-error-and-hint-id',
};

export const WithHiddenLabel = Template.bind({});
WithHiddenLabel.args = {
  ...Default.args,
  hideLabel: true,
  id: 'with-hidden-label-id',
};

export const WithErrorWrapper = Template.bind({});
WithErrorWrapper.args = {
  ...WithError.args,
  id: 'error-wrapper-id',
  hasErrorWrapper: true,
};

export const WithCharacterCount = Template.bind({});
WithCharacterCount.args = {
  ...Default.args,
  id: 'character-count-id',
  hasCharacterCounter: true,
  maxLength: 4000,
};

export const WithDefaultValueAndCounter = Template.bind({});
WithDefaultValueAndCounter.args = {
  ...Default.args,
  id: 'default-value-text-area',
  hasCharacterCounter: true,
  maxLength: 4000,
  defaultValue: 'This is a default value.',
};

export const WithMarkdownLabel = Template.bind({});
WithMarkdownLabel.args = {
  ...Default.args,
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
