import { transformImageForTeaserCard } from './transformImageForTeaserCard';

const assetPath = 'base-url';

describe('transformImageForTeaserCard', () => {
  it('should transform a valid Image object to StaticImageData', () => {
    const image = {
      image: {
        _path: '/images/test.jpg',
        width: 1024,
        height: 768,
        mimeType: 'image/jpeg',
      },
      altText: 'Test Image',
    };

    const result = transformImageForTeaserCard(image, assetPath);

    expect(result).toEqual({
      src: 'base-url/images/test.jpg',
      width: 1024,
      height: 768,
      blurDataURL: undefined,
      blurWidth: undefined,
      blurHeight: undefined,
    });
  });

  it('should throw an error if the image object is invalid', () => {
    expect(() => transformImageForTeaserCard(null, assetPath)).toThrow(
      'Invalid image object',
    );
    expect(() => transformImageForTeaserCard({}, assetPath)).toThrow(
      'Invalid image object',
    );
    expect(() =>
      transformImageForTeaserCard({ image: null }, assetPath),
    ).toThrow('Invalid image object');
  });
});
