import React, { useEffect, useState } from 'react';

import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { twMerge } from 'tailwind-merge';

import { CarouselProps } from '@maps-react/hooks/types';

/**
 * This component is a wrapper around the [Embla Carousel](https://www.embla-carousel.com/) library. Custom hooks can be passed as plugins to extend the functionality of the carousel and add features like autoplay.
 * `useEmblaCarousel.ts` is a (growing) collection of custom hooks levaraging Embla Carousel plugins.
 *
 * The idea being that any variation of a Carousel component can be created with the desired functionality by passing the appropriate plugin hooks and base options.
 */
export const Carousel = ({ children, options, plugins }: CarouselProps) => {
  const [jsEnabled, setJsEnabled] = useState(false);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  const [emblaRef]: UseEmblaCarouselType = useEmblaCarousel(options, plugins);

  return (
    <div className="overflow-hidden" ref={jsEnabled ? emblaRef : null}>
      <div className={twMerge(jsEnabled && 'flex')}>
        {React.Children.map(children, (child) => (
          <div
            className={twMerge('flex-[0_0_100%] min-w-0', !jsEnabled && 'mb-3')}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
