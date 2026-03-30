export enum ERROR_TYPES {
  EMAIL = 'email-generic',
  SESSION_EXPIRED = 'session-expired',
  API_CALL_FAILED = 'generic',
  NOTIFY_ERROR = 'email-sent-error',
}

export const DEFAULT_PREFIX = 'form';

export const BASE_URL = 'https://retirement-budget-planner.moneyhelper.org.uk';

export const PENSION_SURVEY_IDS = {
  production: {
    en: 'informizely-embed-ujqnyilh',
    cy: 'informizely-embed-uljyrlhlk',
  },
  development: {
    en: 'informizely-embed-fjguluwfj',
    cy: 'informizely-embed-zjiieufr',
  },
};

export const CHART_COLOURS = [
  '#00788F',
  '#E67032',
  '#AE0060',
  '#7F992F',
  '#000B3A',
  '#8E2A9E',
  '#D97D7D',
] as const;
