import { ReactNode } from 'react';
import { AutoplayType } from 'embla-carousel-autoplay';
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';

export type TranslationGroup = {
  readonly en: ReactNode;
  readonly cy: ReactNode;
};

export interface CarouselProps {
  /** Options for configuring the carousel behavior. https://www.embla-carousel.com/api/options/ */
  options?: EmblaOptionsType;
  /** Plugins for extending the carousel functionality. https://www.embla-carousel.com/plugins/ */
  plugins?: EmblaPluginType[];
  children: ReactNode;
}

export interface CarouselAutoPlayOptions {
  autoPlayOptions: AutoplayType['options'];
}

export interface CarouselAutoPlayProps
  extends CarouselProps,
    CarouselAutoPlayOptions {}

// Possibly build up a StoryCarouselProps interface as more stories are added
