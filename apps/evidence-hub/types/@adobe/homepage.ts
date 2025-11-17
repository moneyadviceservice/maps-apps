import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { ContentCardType, LinkType } from './components';

export interface VideoData {
  title: string;
  videoUrl?: string;
  transcriptTitle: string;
  transcript: JsonRichText;
}

export interface HomepageTemplate {
  seoTitle: string;
  seoDescription: string;
  breadcrumbs: LinkType[];
  title: string;
  description: JsonRichText;
  cards: ContentCardType[];
  video?: VideoData;
  content?: JsonRichText;
}
