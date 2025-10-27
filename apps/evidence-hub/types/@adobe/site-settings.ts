import { LinkGroup, LinkType, Logo } from './components';

export interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  headerLogo: Logo;
  mainNavigation: LinkType[];
  footerLinks: LinkGroup[];
}
