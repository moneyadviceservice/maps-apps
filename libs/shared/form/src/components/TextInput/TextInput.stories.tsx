import { StoryFn } from '@storybook/nextjs';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { Props, TextInput } from '.';

const StoryProps = {
  title: 'Components/FORM/TextInput',
  component: TextInput,
  tags: ['atom'],
  parameters: {
    docs: {
      description: {
        component: `
This component renders a text input field with optional **label**, **hint**, and **error wrapping** via the \`hasErrorWrapper\` prop.

**Additional information:**
Use the \`children\` prop to include expandable sections with extra context such as an accordion.`,
      },
    },
  },
};

const Template: StoryFn<Props> = (args) => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  id: 'default-id',
  type: 'text',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  ...Default.args,
  label: 'Label',
};

export const NumberInput = Template.bind({});
NumberInput.args = {
  ...Default.args,
  label: 'Numeric Input Only',
  type: 'number',
};

export const WithHint = Template.bind({});
WithHint.args = {
  ...WithLabel.args,
  hint: 'Hint label',
};

export const WithError = Template.bind({});
WithError.args = {
  ...WithLabel.args,
  error: 'Error: message goes here',
};

export const WithErrorAndHint = Template.bind({});
WithErrorAndHint.args = {
  ...WithError.args,
  ...WithHint.args,
};

export const WithErrorWrapper = Template.bind({});
WithErrorWrapper.args = {
  ...WithError.args,
  ...WithHint.args,
  hasErrorWrapper: true,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  ...WithHint.args,
  children: (
    <ExpandableSection title="Help copy">
      <Paragraph>
        This is some extra information that is hidden by default and can be
        revealed by clicking the section title.
      </Paragraph>
    </ExpandableSection>
  ),
};

export const WithErrorAndChildren = Template.bind({});
WithErrorAndChildren.args = {
  ...WithErrorWrapper.args,
  ...WithChildren.args,
};

export default StoryProps;
