export type TDataLayerGenericItem = {
  event: string;
  page?: unknown;
  tool?: unknown;
  eventInfo?: unknown;
  user?: {
    loggedIn: boolean;
    userId: string;
  };
};

export type TDataLayerWindow = Window & {
  adobeDataLayer: TDataLayerGenericItem[];
};

//

export interface IQuestionOption {
  text: string;
  hint?: string;
}

export interface IFieldOption {
  label: string;
  id: string;
}

export interface IExpandableSection {
  title: string;
  text: string;
}

//

interface IBasePageData {
  pageTitle: string;
  sectionTitle: string;
  endpoint: string;
  content?: string;
}

export interface IQuestionPageData extends IBasePageData {
  options: readonly IQuestionOption[];
  expandableSection?: IExpandableSection;
}

export interface IInputPageData extends IBasePageData {
  fields: readonly IFieldOption[];
}

/**
 * ResourcePageData is basically just BasePageData for now.
 */
export type TResourcePageData = IBasePageData;
