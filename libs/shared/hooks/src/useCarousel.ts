import Autoplay from 'embla-carousel-autoplay';
import { CarouselAutoPlayOptions } from './types';

export const useCarouselAutoPlay = ({
  autoPlayOptions,
}: CarouselAutoPlayOptions) => {
  return Autoplay({
    delay: autoPlayOptions?.delay ? autoPlayOptions?.delay : 3000,
    stopOnInteraction: autoPlayOptions?.stopOnInteraction,
    stopOnFocusIn: autoPlayOptions?.stopOnFocusIn,
    stopOnLastSnap: autoPlayOptions?.stopOnLastSnap,
  });
};

// add additional custom hooks leveraging plugins: https://www.embla-carousel.com/plugins/
