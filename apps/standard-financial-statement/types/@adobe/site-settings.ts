import { LinkType, Logo } from './components';

export interface SiteSettings {
  seoTitle: string;
  seoDescription: string;
  headerLogo: Logo;
  headerLogoMobile: Logo;
  headerLinks: LinkType[];
  accountLinks: LinkType[];
  mainNavigation: LinkType[];
  footerLogo: Logo;
  footerLinks: LinkType[];
}

export interface AdminSettings {
  seoTitle: string;
  seoDescription: string;
  headerLogo: Logo;
}
