import type { StaticImageData } from 'next/image';

import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { ContentCardType } from '../../types/@adobe/components';

type RichTextNode = {
  value?: string;
  content?: RichTextNode[];
};

export const extractPlainText = (richText?: JsonRichText): string => {
  if (!richText?.json?.length) {
    return '';
  }

  const extractFromNode = (node: RichTextNode): string => {
    let text = node.value ?? '';

    if (node.content) {
      text += node.content.map(extractFromNode).join(' ');
    }

    return text;
  };

  return richText.json.map(extractFromNode).join(' ').trim();
};

export const getCardKey = (card: ContentCardType) =>
  card.link.linkTo || card.title;

export const isExternalUrl = (url: string) => url.startsWith('http');

export const toTeaserCardImage = (
  card: ContentCardType,
  assetPath: string,
): StaticImageData | undefined => {
  const imagePath = card.image?.image?._path;

  if (!imagePath) {
    return undefined;
  }

  const { width, height } = card.image.image;

  return {
    src: `${assetPath}${imagePath}`,
    width,
    height,
  };
};
