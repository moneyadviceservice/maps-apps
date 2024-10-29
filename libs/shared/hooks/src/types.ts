import { ReactNode } from 'react';
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel';
import { AutoplayOptionsType } from 'embla-carousel-autoplay';

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
  autoPlayOptions: AutoplayOptionsType;
}

export interface CarouselAutoPlayProps
  extends CarouselProps,
    CarouselAutoPlayOptions {}

// Possibly build up a StoryCarouselProps interface as more stories are added
