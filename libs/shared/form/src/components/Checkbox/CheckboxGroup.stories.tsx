import { useState } from 'react';

import { StoryFn } from '@storybook/nextjs';
import { fn } from 'storybook/test';

import { Button } from '@maps-react/common/components/Button';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { CheckboxGroup, CheckboxGroupProps } from './Checkbox';

type SubmitPayload = {
  pizzaToppings: string[];
};

type SubmitStoryArgs = CheckboxGroupProps & {
  onSubmit: (payload: SubmitPayload) => void;
};

const StoryProps = {
  title: 'Components/FORM/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['molecule'],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zOXKbKzt2dhBi1ZOauyUKA/Component-Library---BETA---WIP-?node-id=464-5096&m=dev',
    },
    docs: {
      description: {
        component: `
This component renders a **multi-select checkbox group** with fieldset/legend semantics. All checkboxes share the same field \`name\`, which allows browsers to naturally group values during form submission.

## API Contract

The component is **storage-agnostic** — it handles the visual and accessibility layer, while delegating persistence format decisions to the consuming app:

- **Input**: \`defaultChecked?: string[]\` — Array of selected values for prefill/hydration
- **Output**: Native browser checkbox values via FormData: \`formData.getAll(name)\` → \`string[]\`

## Storage Transformation

The consuming app is responsible for normalizing the checkbox array to its persistence format. Common patterns:

**Flat Record<string, string> store (CSV format):**
\`\`\`tsx
// On submit:
const pizzaToppings = formData.getAll('toppings').map(String);
const storageValue = pizzaToppings.join(',');  // 'addCheese,addOlives'

// On prefill:
const storedValue = 'addCheese,addOlives';
const defaultChecked = storedValue ? storedValue.split(',') : undefined;
\`\`\`

**Other stores:** Adapt normalization as needed (JSON, separate keys, etc.)

## Features

- **Single or multiple items**: Flexible for single-checkbox questions or multi-select groups
- **Item-level hints**: Each checkbox can have its own hint text displayed below the label
- **Group hints**: Optional group-level hint text displayed under the legend
- **Validation**: Error prop shows error message and applies error styling to all checkboxes
- **Conditional error wrapper**: Use \`hasErrorWrapper\` (default \`false\`) to control whether the group is wrapped with the shared \`Errors\` container
- **Expandable children**: Support for additional content below the group
- **Accessibility**: Fieldset/legend, aria-describedby, full keyboard support, screen reader friendly
- **Prefill support**: Use 'defaultChecked' array to hydrate from stored values
- **onChange callback**: Optional callback for real-time updates on selection changes (viewable in the Storybook Actions tab)

## Interactive Examples

The **WithSubmitAction** story demonstrates the component in a real form context with validation. Try submitting without selecting any checkbox to see the error state, then select an item and submit again to clear the error and see form data captured in the Actions tab.

Use **MultipleItemsWithHints** to preview per-item hint rendering, and **WithErrorWithoutErrorWrapper** to verify the conditional \`hasErrorWrapper={false}\` behavior.`,
      },
    },
  },
};

const Template: StoryFn<CheckboxGroupProps> = (args) => (
  <CheckboxGroup key={JSON.stringify(args.defaultChecked)} {...args} />
);

const SubmitTemplate: StoryFn<SubmitStoryArgs> = (args) => {
  const [error, setError] = useState<string | undefined>(undefined);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const pizzaToppings = formData.getAll(args.name).map(String);

        if (pizzaToppings.length === 0) {
          setError('You must select at least one topping');
          return;
        }

        setError(undefined);
        args.onSubmit({
          pizzaToppings,
        });
      }}
    >
      <CheckboxGroup {...args} error={error} />
      <Button type="submit" className="mt-8">
        Submit
      </Button>
    </form>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Pizza toppings',
  hint: 'Choose all that apply',
  name: 'toppings',
  items: [{ label: 'Add cheese', value: 'addCheese' }],
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  items: [{ label: 'Add cheese', value: 'addCheese', disabled: true }],
};

export const Checked = Template.bind({});
Checked.args = {
  ...Default.args,
  defaultChecked: ['addCheese'],
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  error: 'Error: message goes here',
};

export const CheckedWithError = Template.bind({});
CheckedWithError.args = {
  ...Checked.args,
  error: 'Error: message goes here',
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  ...Default.args,
  children: (
    <ExpandableSection title="Additional information">
      <Paragraph>
        This is some extra information that is hidden by default and can be
        revealed by clicking the section title.
      </Paragraph>
    </ExpandableSection>
  ),
};

export const WithErrorAndChildren = Template.bind({});
WithErrorAndChildren.args = {
  ...WithError.args,
  children: (
    <ExpandableSection title="Additional information">
      <Paragraph>
        This is some extra information that is hidden by default and can be
        revealed by clicking the section title.
      </Paragraph>
    </ExpandableSection>
  ),
};

export const WithErrorWrapper = Template.bind({});
WithErrorWrapper.args = {
  ...WithError.args,
  hasErrorWrapper: true,
};

export const MultipleItems = Template.bind({});
MultipleItems.args = {
  ...Default.args,
  items: [
    { label: 'Add cheese', value: 'addCheese' },
    {
      label: 'Add olives',
      value: 'addOlives',
    },
    { label: 'Add peppers', value: 'addPeppers' },
  ],
};

export const MultipleItemsWithHints = Template.bind({});
MultipleItemsWithHints.args = {
  ...MultipleItems.args,
  items: [
    {
      label: 'Add cheese',
      value: 'addCheese',
      hint: 'Extra long hint text for cheese that should be displayed below the cheese option and span multiple lines to test text wrapping and layout of the component when hints are present.',
    },
    {
      label:
        'Add olives so that we can test how the component handles longer label text across multiple lines',
      value: 'addOlives',
      hint: 'Olives are free!',
    },
    { label: 'Add peppers', value: 'addPeppers', hint: 'Peppers are spicy!' },
  ],
};

export const WithSubmitAction = SubmitTemplate.bind({});
WithSubmitAction.args = {
  ...MultipleItems.args,
  hasErrorWrapper: true,
  onSubmit: fn(),
};

export default StoryProps;
