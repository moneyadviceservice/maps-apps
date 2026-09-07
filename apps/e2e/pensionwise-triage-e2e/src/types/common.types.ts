export interface Accordion {
  title: string;
  description: string;
}

export interface QuestionPageData {
  title: string;
  endpoint: string;
  options: readonly string[];
  accordion?: Accordion;
}

export interface IneligiblePageData {
  title: string;
  endpoint: string;
}

export interface TransitionalPageData {
  title: string;
  endpoint: string;
  /// incomplete....
}
