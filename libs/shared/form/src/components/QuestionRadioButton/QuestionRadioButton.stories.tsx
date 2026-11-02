import { StoryFn } from '@storybook/nextjs';

import { Errors } from '@maps-react/common/components/Errors/Errors';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { QuestionRadioButton, QuestionRadioButtonProps } from '.';
import {
  mockChildren,
  mockError,
  mockFormName,
  mockHint,
  mockOptions,
  mockOptionsWithHint,
} from './__mocks__';

const StoryProps = {
  title: 'Components/FORM/QuestionRadioButton',
  component: QuestionRadioButton,
  tags: ['molecule'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zOXKbKzt2dhBi1ZOauyUKA/Component-Library---BETA---WIP-?node-id=5307-13048&m=dev',
    },
    docs: {
      description: {
        component: `
This component can be used for rendering **single** or **multiple** instances of radio buttons as part of a question in a form. Radio buttons in this component are controlled via an array of options of type \`QuestionOption[]\`.

\`\`\`ts
interface QuestionOption {
  text: string;
  value: string;
  hint?: string;
}
\`\`\`

**Hint**: A hint message can be displayed on both on the radio buttons themselves and/or above the radio button group as a whole. 

**Errors**: One error message is displayed for the entire radio button group no matter how many radio buttons are rendered. This works in conjunction with the \`hasError\` prop to visually indicate an error state._(see comments around this deprecating this prop in the table below)_. The \`hasErrorWrapper\` prop makes use of the \`<Error />\` component to wrap the entire radio button group and display the error message.

**Alignment**: Both vertical and horizontal layouts are supported.

**Conditional**: Instances with conditional wording eg 'or' can be handled by using multiple \`QuestionRadioButton\` components passing in different \`idPrefix\` values to distinguish the radio button groups and then seperating them with the conditional text.

**Used Components:**
- [RadioButton](?path=/story/components-form-radiobutton--docs)
- [Errors](?path=/story/components-common-errors--docs)
        `,
      },
    },
  },
};

const Template: StoryFn<QuestionRadioButtonProps> = (args) => (
  <QuestionRadioButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
  children: mockChildren,
  options: mockOptions,
  name: mockFormName,
};

export const SingleOption = Template.bind({});
SingleOption.args = {
  children: mockChildren,
  options: [{ text: 'Radio label', value: 'radio-label-1' }],
  name: mockFormName,
};

export const WithGroupHint = Template.bind({});
WithGroupHint.args = {
  ...Default.args,
  children: mockChildren,
  options: mockOptions,
  name: mockFormName,
  hint: mockHint,
};

export const WithQuestionHints = Template.bind({});
WithQuestionHints.args = {
  ...Default.args,
  children: mockChildren,
  options: mockOptionsWithHint,
  name: mockFormName,
};

export const WithRadioError = Template.bind({});
WithRadioError.args = {
  ...Default.args,
  hasError: true,
  children: mockChildren,
  options: mockOptions,
  name: mockFormName,
};

export const WithErrorMessage = Template.bind({});
WithErrorMessage.args = {
  ...Default.args,
  hasError: true,
  error: mockError,
  children: mockChildren,
  options: mockOptions,
  name: mockFormName,
};

export const WithAllProps = Template.bind({});
WithAllProps.args = {
  ...Default.args,
  hasError: true,
  error: mockError,
  hasErrorWrapper: true,
  children: mockChildren,
  options: mockOptionsWithHint,
  name: mockFormName,
  hint: mockHint,
};

export const HorizontalLayout = Template.bind({});
HorizontalLayout.args = {
  ...Default.args,
  children: 'Label dual combinations',
  options: [
    { text: 'Yes', value: 'yes' },
    { text: 'No', value: 'no' },
  ],
  horizontalLayout: true,
  name: 'horizontalOptions',
};

export const HorizontalLayoutAllProps = Template.bind({});
HorizontalLayoutAllProps.args = {
  ...Default.args,
  children: 'Label dual combinations',
  options: [
    { text: 'Yes', value: 'yes' },
    { text: 'No', value: 'no' },
  ],
  horizontalLayout: true,
  hasError: true,
  hasErrorWrapper: true,
  error: mockError,
  hint: mockHint,
  name: 'horizontalOptions',
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  options: mockOptions,
  name: mockFormName,
};
export const WithHiddenLabel = Template.bind({});
WithHiddenLabel.args = {
  options: mockOptions,
  name: mockFormName,
  hideLabel: true,
  children: mockChildren,
};

export const WithMarkdownLabel = Template.bind({});
WithMarkdownLabel.args = {
  options: mockOptions,
  name: mockFormName,
  children: (
    <Markdown content="**Bold label** with [link](https://www.moneyhelper.org.uk)" />
  ),
};

export const WithConditionalOption: StoryFn<QuestionRadioButtonProps> = () => {
  return (
    <Errors errors={[]}>
      <QuestionRadioButton
        options={[
          { text: 'Radio label', value: 'radio-label-1' },
          { text: 'Radio label', value: 'radio-label-2' },
          { text: 'Radio label', value: 'radio-label-3' },
        ]}
        name={mockFormName}
        idPrefix="primary"
      />
      <Paragraph className="pl-2 my-6">or</Paragraph>
      <QuestionRadioButton
        options={[{ text: 'Radio label', value: 'radio-label-4' }]}
        name={mockFormName}
        idPrefix="secondary"
      />
    </Errors>
  );
};

export const WithConditionalOptionWithError: StoryFn<
  QuestionRadioButtonProps
> = () => {
  return (
    <Errors errors={[mockError]}>
      <QuestionRadioButton
        options={[
          { text: 'Radio label', value: 'radio-label-1' },
          { text: 'Radio label', value: 'radio-label-2' },
          { text: 'Radio label', value: 'radio-label-3' },
        ]}
        name={mockFormName}
        error={mockError}
        hasError={true}
        idPrefix="primary"
      />
      <Paragraph className="pl-2 my-6">or</Paragraph>
      <QuestionRadioButton
        options={[{ text: 'Radio label', value: 'radio-label-4' }]}
        name={mockFormName}
        hasError={true}
        idPrefix="secondary"
      />
    </Errors>
  );
};

export default StoryProps;
