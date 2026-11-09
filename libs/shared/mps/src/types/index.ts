import { CheckboxGroupItem } from '@maps-react/form/components/Checkbox';

export type LinkType = {
  text: string;
  linkTo: string;
};

export type FooterType = {
  title: string;
  childLinks: LinkType[];
};

export interface ImageType {
  _path: string;
  width: number;
  height: number;
  mimeType: string;
}

export interface Logo {
  image: ImageType;
  altText: string;
}

export interface NavigationItem {
  text: string;
  linkTo?: string;
  children?: NavigationItem[];
}

export interface SideNavigationLink {
  title: string;
  link: string;
}

export interface SideNavigationModel {
  navigationTitle: string;
  links: SideNavigationLink[];
}

export interface Tags {
  group: string;
  key: string;
  tags: CheckboxGroupItem[];
  checked?: string[];
}
