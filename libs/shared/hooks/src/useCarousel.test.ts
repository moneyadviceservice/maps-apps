import Autoplay from 'embla-carousel-autoplay';

import { CarouselAutoPlayOptions } from './types';
import { useCarouselAutoPlay } from './useCarousel';

jest.mock('embla-carousel-autoplay', () => {
  return jest.fn();
});

describe('useCarouselAutoPlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use provided delay when autoPlayOptions.delay is defined', () => {
    // Arrange
    const autoPlayOptions = {
      delay: 5000,
    } as CarouselAutoPlayOptions['autoPlayOptions'];

    // Act
    useCarouselAutoPlay({ autoPlayOptions } as CarouselAutoPlayOptions);

    // Assert
    expect(Autoplay).toHaveBeenCalledWith(
      expect.objectContaining({ delay: 5000 }),
    );
  });

  it('should use default delay when autoPlayOptions.delay is not defined', () => {
    // Arrange
    useCarouselAutoPlay({} as CarouselAutoPlayOptions);

    // Assert & Act
    expect(Autoplay).toHaveBeenCalledWith(
      expect.objectContaining({ delay: 3000 }),
    );
  });
});
