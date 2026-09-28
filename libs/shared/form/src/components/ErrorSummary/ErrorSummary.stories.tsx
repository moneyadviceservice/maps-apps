import { StoryFn } from '@storybook/nextjs';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Markdown } from '@maps-react/vendor/components/Markdown/Markdown';

import { ErrorSummary } from './ErrorSummary';

const StoryProps = {
  title: 'Components/FORM/ErrorSummary',
  component: ErrorSummary,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zOXKbKzt2dhBi1ZOauyUKA/Component-Library---BETA---WIP-?node-id=4918-3368&m=dev',
    },
    docs: {
      description: {
        component: `
  Renders a list of error messages with links to the corresponding form fields.
  
  Will not render if there are no errors. Accepts children to provide additional context or instructions.
  
  **Used Components:**
  - [ListElement](?path=/story/components-common-listelement--docs)
  - [Heading](?path=/story/components-common-heading--docs)
          `,
      },
    },
  },
  argTypes: {
    title: {
      description: 'The title of the error summary.',
      control: { type: 'text' },
      table: {
        type: { summary: 'string' },
      },
    },
    errors: {
      description:
        'An object containing the form errors, where the keys are the field names and the values are arrays of error messages. No errors will result in no error summary being displayed.',
      control: { type: 'object' },
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    errorKeyPrefix: {
      description:
        'A prefix to add to the error link hrefs. This is useful if you have multiple forms on the same page and want to ensure the error links point to the correct form fields.',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    classNames: {
      description:
        'Optional additional class names to add to the error summary for custom styling.',
      control: { type: 'text' },
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    handleErrorClick: {
      description:
        'An optional click handler for when an error link is clicked. This can be used to perform additional actions, such as logging or analytics.',
      control: { type: 'function' },
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    titleLevel: {
      description:
        'The semantic level for the title heading. This is passed to the `component` prop of the Heading component and should be chosen based on the structure of your page to maintain accessibility and SEO best practices.',
      control: {
        type: 'select',
        options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      },
      table: {
        type: { summary: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'" },
        defaultValue: { summary: 'h2' },
      },
    },
    children: {
      description:
        'Optional additional content to display below the list of errors, such as guidance or links.',
      table: {
        type: { summary: 'React.ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
};

const Template: StoryFn<typeof ErrorSummary> = (args) => (
  <ErrorSummary {...args} />
);

const errors: Record<string, (string | undefined)[]> | null = {
  buyerType: ['Select the type of property you are buying'],
  price: ['Enter a property price, for example £200,000'],
  price2: ['Enter a property price, for example £200,000'],
  price3: ['Enter a property price, for example £200,000'],
  fieldWithNoErrors: [],
  fieldWithEmptyError: [' '],
};

/**
 * Error object with multiple fields containing errors, some with no errors and some with empty error messages
 */
export const MultipleErrors = Template.bind({});
MultipleErrors.args = {
  title: 'There is a problem',
  errors,
};

export const WithSingleError = Template.bind({});
WithSingleError.args = {
  title: 'There is a problem',
  errors: {
    buyerType: ['Select the type of property you are buying'],
  },
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  title: 'There is a problem',
  errors,
  children: (
    <div className="text-gray-800">
      <Paragraph>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit ipsam
        delectus aliquid cupiditate consequatur molestiae dolore? Labore culpa,
        soluta ratione neque vero mollitia illo similique ex architecto.
        Officiis, reiciendis eos?
      </Paragraph>
      <Markdown
        content={`Markdown using **bold**, and _italic_ and [links](#).`}
      />
      <Paragraph>
        <Link href="#">Standard link</Link>
      </Paragraph>
    </div>
  ),
};

/**
 * No errors provided - renders nothing
 */
export const EmptyErrors = Template.bind({});
EmptyErrors.args = {
  title: 'There is a problem',
};

/**
 * Fields with empty error messages or no errors at all - renders nothing
 */
export const FieldWithNoErrors = Template.bind({});
FieldWithNoErrors.args = {
  title: 'There is a problem',
  errors: {
    'field-with-no-errors': [],
    'field-with-empty-error': [' '],
  },
};

export default StoryProps;
