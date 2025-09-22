import { StoryFn } from '@storybook/nextjs';

import { ErrorSummary } from './ErrorSummary';

const StoryProps = {
  title: 'Components/TOOLS/ErrorSummary',
  component: ErrorSummary,
};

const Template: StoryFn<typeof ErrorSummary> = (args) => (
  <ErrorSummary {...args} />
);

export const Default = Template.bind({});
Default.args = {
  title: 'There is a problem',
  description: [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.',
    'Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
  ],
  errors: {
    buyerType: ['Select the type of property you are buying'],
    price: ['Enter a property price, for example £200,000'],
  },

  titleLevel: 'h3',
};

export default StoryProps;
