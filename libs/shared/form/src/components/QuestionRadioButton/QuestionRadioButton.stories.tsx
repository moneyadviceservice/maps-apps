import { StoryFn } from '@storybook/nextjs';

import { H2 } from '@maps-react/common/components/Heading';

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

A hint message can be displayed on both on the radio buttons themselves and/or above the radio button group as a whole. 

One error message is displayed for the entire radio button group no matter how many radio buttons are rendered. This works in conjunction with the \`hasError\` prop to visually indicate an error state._(see comments around this deprecating this prop in the table below)_.

Both vertical and horizontal layouts are supported as well as an \`<Error />\` wrapper.

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
export const WithHiddenLabel = () => (
  <>
    <H2>Title</H2>
    <QuestionRadioButton
      options={mockOptions}
      name={mockFormName}
      hideLabel={true}
    >
      Screen reader only label
    </QuestionRadioButton>
  </>
);

export default StoryProps;
