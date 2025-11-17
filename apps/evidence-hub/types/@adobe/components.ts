import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

export interface LinkType {
  linkTo: string;
  text: string;
  externalLink?: boolean;
  description: string | null;
}

export type LinkGroup = {
  title: string | null;
  childLinks: LinkType[];
};

export interface Logo {
  image: ImageType;
  altText: string;
}

export interface ImageType {
  _path: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface ContentCardType {
  title: string;
  description: JsonRichText;
  image: Logo;
  link: LinkType;
}

export interface VideoSection {
  videoUrl: string;
  transcriptTitle: string;
  transcript: JsonRichText;
}
