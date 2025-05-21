import { StoryFn } from '@storybook/react';

import { CarouselAutoPlayProps, CarouselProps } from '@maps-react/hooks/types';
import { useCarouselAutoPlay } from '@maps-react/hooks/useCarousel';

import { Carousel } from '.';

const StoryProps = {
  title: 'Components/COMMON/Carousel',
  component: Carousel,
};

const Template: StoryFn<CarouselProps> = () => (
  <Carousel>
    <div>Slide 1</div>
    <div>Slide 2</div>
    <div>Slide 3</div>
  </Carousel>
);

export const Default = Template.bind({});

export const AutoPlay = (args: CarouselAutoPlayProps) => {
  const plugins = [
    useCarouselAutoPlay({
      autoPlayOptions: args.autoPlayOptions,
    }),
  ];

  return (
    <Carousel {...args} plugins={plugins}>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </Carousel>
  );
};
AutoPlay.args = {
  options: { loop: true, watchDrag: false },
  autoPlayOptions: {
    delay: 4000,
    stopOnInteraction: false,
    stopOnFocusIn: false,
    stopOnLastSnap: false,
  },
};
AutoPlay.parameters = {
  docs: {
    description: {
      story:
        'This carousel makes use of the `useWithAutoPlay` custom hook to add autoplay functionality to the carousel. See `useEmblaCarousel.ts` for more details.',
    },
  },
};
export const JSDisabled = () => {
  return (
    <div>
      <div>Slide 1</div>
      <div>Slide 2</div>
      <div>Slide 3</div>
    </div>
  );
};
JSDisabled.parameters = {
  docs: {
    description: {
      story:
        'This is a fallback for when JavaScript is disabled. The carousel will not be interactive and will display all slides stacked on top of each other.',
    },
  },
};

export default StoryProps;
