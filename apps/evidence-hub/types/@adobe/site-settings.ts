import {
  FooterType,
  LinkType,
  Logo,
  NavigationItem,
} from '@maps-react/mps/types';

export type SiteSettings = {
  seoTitle: string;
  seoDescription: string;
  headerLogo: Logo;
  mainNavigation: LinkType[];
  navigation: NavigationItem[];
  footerLinks: FooterType[];
};
