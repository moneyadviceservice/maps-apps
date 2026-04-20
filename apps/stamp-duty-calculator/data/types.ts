import { TranslationGroup } from '@maps-react/hooks/types';

export type ContentBlock =
  | { type: 'paragraph'; content: TranslationGroup }
  | { type: 'list'; preamble?: TranslationGroup; items: TranslationGroup[] }
  | {
      type: 'table';
      heading?: TranslationGroup;
      columns: TranslationGroup;
      data: string[][];
    };

export interface ContentPeriod {
  startDate: Date;
  endDate: Date | null;
  contentBlocks: ContentBlock[];
}

export interface BuyerContentConfig {
  buyerType: string;
  periods: ContentPeriod[];
}
