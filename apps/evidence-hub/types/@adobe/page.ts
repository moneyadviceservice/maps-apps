import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { LinkType } from './components';

export interface Tag {
  name: string;
  key: string;
}

export interface DocumentTemplate {
  seoTitle: string;
  seoDescription: string;
  title: string;
  slug: string;
  publishDate: string;
  lastUpdatedDate?: string;
  pageType?: Tag;
  dataType?: Tag[];
  tags?: Tag[];
  breadcrumbs?: LinkType[];
  sections: JsonRichText[];
  contactInformation: JsonRichText;
  clientGroup: Tag[];
  topic: Tag[];
  countryOfDelivery: Tag[];
  links: LinkType[];
  overview?: JsonRichText;
}

export interface TagListItem {
  tagGroup: {
    label: string;
    tags: Tag[];
  };
}
