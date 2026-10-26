export type Language = 'en' | 'cy';

export type DataLayerGenericItem = {
  event: string;
  page?: unknown;
  tool?: unknown;
  eventInfo?: unknown;
};

export interface LocalisedText {
  en: string;
  cy: string;
}

export interface ExpectedPage {
  categoryL1: string;
  categoryL2: string;
  pageName: string;
  pageTitle: LocalisedText;
  site: string;
  pageType: string;
  source: string;
}

export interface ExpectedTool {
  stepName: string;
  toolCategory: string;
  toolName: string;
  toolStep: number;
}

export interface ExpectedErrorDetail {
  reactCompType: string;
  reactCompName: string;
  errorMessage: LocalisedText;
}

export interface ExpectedEventInfo {
  toolName: string;
  toolStep: string;
  stepName: string;
  errorDetails: ExpectedErrorDetail[];
}

export interface AdobeDataLayerScenario {
  url: string;
  page?: ExpectedPage;
  tool?: ExpectedTool;
  eventInfo?: ExpectedEventInfo;
}

export interface AdobeDataLayerPage {
  categoryL1?: string;
  categoryL2?: string;
  pageName?: string;
  pageTitle?: string;
  site?: string;
  pageType?: string;
  source?: string;
  lang?: string;
}

export interface AdobeDataLayerTool {
  stepName?: string;
  toolCategory?: string;
  toolName?: string;
  toolStep?: number;
}

export interface AdobeDataLayerErrorDetail {
  reactCompType?: string;
  reactCompName?: string;
  errorMessage?: string;
}

export interface AdobeDataLayerEventInfo {
  toolName?: string;
  toolStep?: string;
  stepName?: string;
  errorDetails?: AdobeDataLayerErrorDetail[];
}

export interface AdobeDataLayerEntry {
  event?: string;
  page?: AdobeDataLayerPage;
  tool?: AdobeDataLayerTool;
  eventInfo?: AdobeDataLayerEventInfo;
}

declare global {
  interface Window {
    adobeDataLayer?: AdobeDataLayerEntry[];
  }
}
