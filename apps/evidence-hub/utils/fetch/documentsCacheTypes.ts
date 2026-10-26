import { DocumentTemplate } from 'types/@adobe/page';

import type { DocSearchEntry } from '../search/keywordSearch';

export type SlimDocument = Omit<DocumentTemplate, 'sections'> & {
  /**
   * Intentionally omit heavy section JSON from list/search payloads.
   * (Document page uses the full document query instead.)
   */
  sections: [];
};

export type SearchTextBySlug = Map<string, DocSearchEntry>;
