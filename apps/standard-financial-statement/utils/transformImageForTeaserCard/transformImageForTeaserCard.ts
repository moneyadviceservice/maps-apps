import { StaticImageData } from 'next/image';
import { Image } from 'types/@adobe/components';

export const transformImageForTeaserCard = (
  image: Image,
  assetPath: string,
): StaticImageData => {
  if (!image?.image) {
    throw new Error('Invalid image object');
  }

  const { _path, width, height } = image.image;

  return {
    src: `${assetPath}${_path}`,
    width,
    height,
  };
};
