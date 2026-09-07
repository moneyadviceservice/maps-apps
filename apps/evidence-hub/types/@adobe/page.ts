import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { LinkType } from './components';

export interface Tag {
  name: string;
  key: string;
}

export interface PageTemplate {
  seoTitle: string;
  seoDescription: string;
  title: string;
  slug: string;
  breadcrumbs: LinkType[];
  /**
   * Sections can be returned as rich-text JSON (used for rendering document pages)
   * or as plaintext (used for list/search queries to avoid heavy JSON payloads).
   */
  sections: Array<JsonRichText | { plaintext: string }>;
  overview?: JsonRichText;
}

export interface DocumentTemplate extends PageTemplate {
  publishDate: string;
  lastUpdatedDate?: string;
  pageType?: Tag;
  dataTypes?: Tag[];
  tags?: Tag[];
  contactInformation: JsonRichText;
  clientGroup: Tag[];
  topic: Tag[];
  countryOfDelivery: Tag[];
  links: LinkType[];
  overview?: JsonRichText;
  organisation?: Tag[];
}

export interface TagGroup {
  label: string;
  slug: string;
  key: string;
  tags: Tag[];
}

export interface TagListItem {
  tagGroup: TagGroup;
}
