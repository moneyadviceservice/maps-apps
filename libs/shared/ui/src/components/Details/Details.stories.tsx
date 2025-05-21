import { StoryFn } from '@storybook/react';

import { DetailsProps } from '.';
import { Details } from './Details';

const StoryProps = {
  title: 'Components/COMMON/Details',
  component: Details,
};

const Template: StoryFn<DetailsProps> = (args) => <Details {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Details title',
  children: (
    <div>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry's standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </div>
  ),
};

export default StoryProps;
