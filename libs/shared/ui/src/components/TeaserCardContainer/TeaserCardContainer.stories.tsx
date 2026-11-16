import { StoryFn } from '@storybook/nextjs';

import { TeaserCard } from '../TeaserCard/TeaserCard';
import image1 from './bubbles.jpg';
import { Props, TeaserCardContainer } from './TeaserCardContainer';

const StoryProps = {
  title: 'Components/COMMON/TeaserCardContainer',
  component: TeaserCardContainer,
};

const Template: StoryFn<Props> = (args) => <TeaserCardContainer {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      <TeaserCard
        title="The title"
        image={image1}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta"
        href="https://www.example.org"
      />
      <TeaserCard
        title="The title"
        image={image1}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta"
        href="https://www.example.org"
      />
      <TeaserCard
        title="The title"
        image={image1}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta"
        href="https://www.example.org"
      />
      <TeaserCard
        title="The title"
        image={image1}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere, augue sed imperdiet porta"
        href="https://www.example.org"
      />
    </>
  ),
};

export default StoryProps;
