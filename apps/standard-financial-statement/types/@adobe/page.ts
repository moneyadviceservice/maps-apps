import { EmbeddedToolData } from '@maps-react/core/components/EmbeddedTool';
import { JsonRichText, Node } from '@maps-react/vendor/utils/RenderRichText';

import { LinkType, Logo, SideNavigationItemGroup } from './components';

interface BasePageTemplate {
  seoTitle: string;
  seoDescription: string;
  breadcrumbs?: LinkType[];
  title: string;
  introText?: JsonRichText;
  downloads: Download[];
  content: JsonRichText[];
}

export interface PageTemplate extends BasePageTemplate {
  sideNavigationLinks: LinkType[];
  governanceTitle?: string;
  governanceList: OrganisationType[];
  embed: EmbeddedToolData | null;
}

export interface UseTheSfsPageTemplate extends BasePageTemplate {
  navigationGroup: SideNavigationItemGroup[];
  loginMessage: {
    loginIntro: JsonRichText | null;
  } | null;
  authorisedIntroText: JsonRichText | null;
  authorisedContent: JsonRichText[] | null;
}

export interface Download {
  fileName: string;
  asset: {
    size: number;
    _path: string;
    type: string;
  };
}

export interface PageSection {
  header: {
    text: string;
    id: string;
  };
  json: Node[];
}

export interface PageSectionTemplate {
  seoTitle: string;
  seoDescription: string;
  title: string;
  breadcrumbs?: LinkType[];
  section: JsonRichText[];
  sideNavigationLinks: LinkType[];
}

export interface OrganisationType {
  link: LinkType;
  governanceLogo: Logo;
}

export type PageError = {
  error: boolean;
};
