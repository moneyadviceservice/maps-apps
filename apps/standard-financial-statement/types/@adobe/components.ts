import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

export interface LinkType {
  linkTo: string;
  text: string;
  description: string | null;
}

export type SideNavigationItemGroup = {
  title: string | null;
  childLinks: LinkType[];
};

export interface Logo {
  image: ImageType;
  altText: string;
}

export interface Image {
  image: ImageType;
  altText: string;
}

export interface ImageType {
  _path: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface HeroObject {
  title: string;
  description: JsonRichText;
  image: Logo;
  link: LinkType;
}

export type TeaserCard = {
  title: string;
  description: string;
  href: string;
  image: Image;
};
