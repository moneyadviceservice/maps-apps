import { StaticImageData } from 'next/image';

import { Image } from 'types/@adobe/components';

export const transformImageToStaticImageData = (
  image: Image | null,
  assetPath: string,
  xWidth?: number,
  yHeight?: number,
  altText?: string,
): StaticImageData & { altText?: string } => {
  if (!image) {
    return {
      src: '/',
      width: xWidth ?? 0,
      height: yHeight ?? 0,
      altText: altText ?? '',
    };
  }

  const { _path, width, height } = image.image;

  return {
    src: `${assetPath}${_path}`,
    width: xWidth ?? width,
    height: yHeight ?? height,
    altText: altText ?? image.altText,
  };
};
