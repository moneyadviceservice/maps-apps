import { StoryFn } from '@storybook/react';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer, Props } from './TeaserCardContainer';
import image1 from '../../public/images/bubbles.jpg';

const StoryProps = {
  title: 'Components/TOOLS/TeaserCardContainer',
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
