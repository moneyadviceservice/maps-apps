import { CheckboxGroupItem } from '@maps-react/form/components/Checkbox';
import { FooterType, Logo, NavigationItem } from '@maps-react/mps/types';
import { Node } from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

export type QueryParams = Record<string, string[] | string | undefined>;

export type SEOTypes = {
  seoTitle: string;
  seoDescription: string;
};

export type SiteConfigType = SEOTypes & {
  navigation: NavigationItem[];
  headerLogo: Logo;
  footerLinks: FooterType[];
};

export type TagCategoryModel = {
  categoryTitleEn: string;
  categoryTitleCy: string;
  categoryKey: string;
  order: number;
};

export type TagModel = {
  tagCategory: TagCategoryModel;
  titleEn: string;
  titleCy: string;
  value: string;
  isChecked?: boolean;
};

export interface DetailsPageModel {
  seoTitle: string;
  seoDescription: string;
  slug: string;
  pageTitle: string;
  pageTags: TagModel[];
  owner: string;
  dateAccredited: string;
  dateLaunched: string;
  preRequisite: string;
  furtherInfo: { json: Node[] };
  descriptionTitle: string;
  description: { json: Node[] };
  preRequisiteSection: { json: Node[] };
  individualCertification: { json: Node[] };
  outcomeTitle: string;
  outcomesSection: { json: Node[] };
}

export type GroupedTag = {
  group: string;
  key: string;
  tags: CheckboxGroupItem[];
  order: number;
  checked?: string[];
};
export interface FrameworkPageModel {
  seoTitle: string;
  seoDescription: string;
  pageTitle: string;
  frameworkSummary: { json: Node[] | null };
}

export interface ActivitySet {
  title: string;
  description: { json: Node[] };
}

export interface StartPageModel {
  seoTitle: string;
  seoDescription: string;
  bannerTitle: string;
  startPageActivityHeading: string;
  startPageIntro: { json: Node[] };
  startPageActivitySetsHeading: string;
  startPageActivitySetsInformation: { json: Node[] };
  activitySets: ActivitySet[];
  informationalCalloutTitle: string;
  informationalCallout: { json: Node[] };
}

export type UpdateHeadingLevel = 'h3' | 'h4';

export interface UpdateLinkModel {
  linkTitle: string;
  linkUrl: string | null;
  document: { _path: string } | null;
}

export interface UpdateSectionModel {
  sectionTitle: string;
  headingLevel: UpdateHeadingLevel;
  slug: string | null;
  updates: UpdateLinkModel[];
}

export interface UpdatePageModel {
  seoTitle: string;
  seoDescription: string;
  pageTitle: string;
  anchorLinksTitle: string;
  guidanceTitle: string;
  introText: { json: Node[] };
  updateSections: UpdateSectionModel[];
}

export interface DetailsPagesListModel {
  slug: string;
  pageTitle: string;
  overview: { json: Node[]; plaintext?: string };
  pageTags: TagModel[];
  owner: string;
  dateLaunched: string;
  description?: { plaintext: string };
  preRequisiteSection?: { plaintext: string };
  individualCertification?: { plaintext: string };
  outcomeTitle?: string;
  outcomesSection?: { plaintext: string };
}

export interface DirectoryPageMetadata {
  seoTitle: string;
  seoDescription: string | undefined;
  bannerTitle: string;
}
