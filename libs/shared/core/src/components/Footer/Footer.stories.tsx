import { Meta, StoryFn } from '@storybook/nextjs';

import { Footer } from '.';

const meta: Meta<typeof Footer> = {
  title: 'Components/CORE/Footer',
  component: Footer,
  parameters: {
    docs: {
      description: {
        component:
          'MoneyHelper footer. Set showTrustpilot to display the Trustpilot Mini widget (requires network access to load the TrustBox iframe in Storybook).',
      },
    },
  },
};

export default meta;

const Template: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});

export const WithTrustpilot = Template.bind({});
WithTrustpilot.args = {
  showTrustpilot: true,
};

export const GridLayout = Template.bind({});
GridLayout.args = {
  layout: 'grid',
};
