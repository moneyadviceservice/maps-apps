import { LinkGroup, LinkType, Logo, NavigationItem } from './components';

export interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  headerLogo: Logo;
  mainNavigation: LinkType[];
  navigation: NavigationItem[];
  footerLinks: LinkGroup[];
}
