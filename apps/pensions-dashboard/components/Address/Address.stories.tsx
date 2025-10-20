import { StoryFn } from '@storybook/nextjs';

import { Address, AddressProps } from '.';

const StoryProps = {
  title: 'Components/MHPD/Address',
  component: Address,
};

const Template: StoryFn<AddressProps> = (args) => <Address {...args} />;

export const Default = Template.bind({});
Default.args = {
  address: {
    postalName: 'Postal Name',
    line1: 'Line 1',
    line2: 'Line 2',
    line3: 'Line 3',
    line4: 'Line 4',
    line5: 'Line 5',
    postcode: 'POST CODE',
    countryCode: 'GB',
  },
};

export default StoryProps;
