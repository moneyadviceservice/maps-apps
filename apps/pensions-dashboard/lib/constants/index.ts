import Cookies from 'cookies';

export const STATE_RETIREMENT_AGE = 67;

export const NO_DATA = '--';

export const NUMBER_WORDS = [
  { en: 'zero', cy: 'sero' },
  { en: 'one', cy: 'un' },
  { en: 'two', cy: 'dau' },
  { en: 'three', cy: 'tri' },
  { en: 'four', cy: 'pedwar' },
  { en: 'five', cy: 'pump' },
  { en: 'six', cy: 'chwech' },
  { en: 'seven', cy: 'saith' },
  { en: 'eight', cy: 'wyth' },
  { en: 'nine', cy: 'naw' },
  { en: 'ten', cy: 'deg' },
  { en: 'eleven', cy: 'un ar ddeg' },
  { en: 'twelve', cy: 'deuddeg' },
];

export const PROTOCOL =
  process?.env.NODE_ENV === 'development' ? 'http://' : 'https://';

export const COOKIE_OPTIONS = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
} as Cookies.SetOption;

export enum PensionsCardType {
  CONFIRMED = 'CONFIRMED',
  CONFIRMED_NO_INCOME = 'CONFIRMED_NO_INCOME',
  PENDING = 'PENDING',
}

export enum MatchType {
  DEFN = 'DEFN',
  POSS = 'POSS',
  CONT = 'CONT',
  NEW = 'NEW',
  SYS = 'SYS',
}

export enum PensionType {
  AVC = 'AVC',
  CB = 'CB',
  CDC = 'CDC',
  DB = 'DB',
  DC = 'DC',
  HYB = 'HYB',
  SP = 'SP',
}

export enum PensionOrigin {
  A = 'A',
  PC = 'PC',
  PM = 'PM',
  PT = 'PT',
  WC = 'WC',
  WM = 'WM',
  WT = 'WT',
}

export enum PensionStatus {
  A = 'A',
  I = 'I',
  IPPF = 'IPPF',
  IWU = 'IWU',
}

export enum AlternateNameType {
  FOR = 'FOR',
  OTH = 'OTH',
}

export enum EmployerStatus {
  C = 'C',
  H = 'H',
}

export enum InformationType {
  C_AND_C = 'C_AND_C',
  SIP = 'SIP',
  IMP = 'IMP',
  ANR = 'ANR',
  SP = 'SP',
}

export enum RetrievalStatus {
  NEW = 'NEW',
  RETRIEVAL_REQUESTED = 'RETRIEVAL_REQUESTED',
  RETRIEVAL_COMPLETE = 'RETRIEVAL_COMPLETE',
  RETRIEVAL_FAILED = 'RETRIEVAL_FAILED',
}

export enum UsageType {
  A = 'A',
  M = 'M',
  N = 'N',
  S = 'S',
  W = 'W',
}

export enum IllustrationType {
  ERI = 'ERI',
  AP = 'AP',
  DB = 'DB',
}

export enum BenefitType {
  AVC = 'AVC',
  CBL = 'CBL',
  CBS = 'CBS',
  CDI = 'CDI',
  CDL = 'CDL',
  DB = 'DB',
  DBL = 'DBL',
  DC = 'DC',
  SP = 'SP',
}

export enum UnavailableReason {
  ANO = 'ANO',
  DB = 'DB',
  DBC = 'DBC',
  DCC = 'DCC',
  DCHA = 'DCHA',
  DCHP = 'DCHP',
  DCSM = 'DCSM',
  MEM = 'MEM',
  NEW = 'NEW',
  NET = 'NET',
  PPF = 'PPF',
  TRN = 'TRN',
  WU = 'WU',
}

export enum IllustrationWarning {
  AVC = 'AVC',
  CUR = 'CUR',
  DEF = 'DEF',
  FAS = 'FAS',
  PEO = 'PEO',
  PNR = 'PNR',
  PSO = 'PSO',
  SPA = 'SPA',
  TVI = 'TVI',
  INP = 'INP',
}

export enum CalculationMethod {
  BS = 'BS',
  CBI = 'CBI',
  SMPI = 'SMPI',
}

export enum LumpSumAmountType {
  CSH = 'CSH',
  CSHL = 'CSHL',
  CSHN = 'CSHN',
}

export enum RecurringAmountType {
  INC = 'INC',
  INCL = 'INCL',
  INCN = 'INCN',
}

export enum AmountNotProvidedReason {
  SML = 'SML',
}

export enum ContactMethods {
  TELEPHONE = 'number',
  EMAIL = 'email',
  POSTAL_NAME = 'postalName',
  WEB_CONTACTS = 'url',
}

export const BACK_LINKS: { [key in string]: string } = {
  CONFIRMED: '/your-pension-breakdown',
  INCOMPLETE: '/pending-pensions',
  UNCONFIRMED: '/pensions-that-need-action',
  '': '/your-pension-search-results',
};

// API response messages
export const REQUEST_ABANDONED = 'Network request was abandoned';
export const RESPONSE_NOT_OK = 'Network response was not ok';
export const RESPONSE_NOT_ACCEPTED = 'Network response was not accepted';
export const REQUEST_FAILED = 'Network request failed';
export const DATA_NOT_FOUND = 'Data not found';

export const DEFAULT_LOAD_TIME = 80;

export enum PensionGroup {
  GREEN = 'green',
  GREEN_NO_INCOME = 'green_no_income',
  RED = 'red',
  YELLOW = 'yellow',
}
