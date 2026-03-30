import { Image } from 'types/@adobe/components';

import { transformImageToStaticImageData } from './transformImageToStaticImageData';

const assetPath = 'base-url';

describe('transformImageForTeaserCard', () => {
  const image = {
    image: {
      _path: '/images/test.jpg',
      width: 1024,
      height: 768,
      mimeType: 'image/jpeg',
    },
    altText: 'Test Image',
  };

  it('should transform a valid Image object to StaticImageData', () => {
    const result = transformImageToStaticImageData(image, assetPath);

    expect(result).toEqual({
      src: 'base-url/images/test.jpg',
      width: 1024,
      height: 768,
      altText: 'Test Image',
    });
  });

  it('should override image width and height if xWdith and yHeight are passed in', () => {
    const result = transformImageToStaticImageData(
      image,
      assetPath,
      102.4,
      76.8,
    );

    expect(result).toEqual({
      src: 'base-url/images/test.jpg',
      width: 102.4,
      height: 76.8,
      altText: 'Test Image',
    });
  });

  it('should return fallback values if the image object is null', () => {
    const expectedErrorFallback = {
      src: '/',
      width: 0,
      height: 0,
      altText: '',
    };

    expect(
      transformImageToStaticImageData(null as unknown as Image, assetPath),
    ).toEqual(expectedErrorFallback);
  });
});
