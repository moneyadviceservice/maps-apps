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
  sections: JsonRichText[];
  overview?: JsonRichText;
}

export interface DocumentTemplate extends PageTemplate {
  publishDate: string;
  lastUpdatedDate?: string;
  pageType?: Tag;
  dataType?: Tag[];
  tags?: Tag[];
  contactInformation: JsonRichText;
  clientGroup: Tag[];
  topic: Tag[];
  countryOfDelivery: Tag[];
  links: LinkType[];
  overview?: JsonRichText;
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
