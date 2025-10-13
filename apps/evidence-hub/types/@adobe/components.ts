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
