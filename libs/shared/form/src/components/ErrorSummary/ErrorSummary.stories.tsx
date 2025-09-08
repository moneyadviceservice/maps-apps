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
  errors: {
    buyerType: ['Select the type of property you are buying'],
    price: ['Enter a property price, for example £200,000'],
  },

  titleLevel: 'h3',
};

export default StoryProps;
