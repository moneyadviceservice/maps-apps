import {
  AlternateNameType,
  AmountNotProvidedReason,
  BenefitType,
  CalculationMethod,
  EmployerStatus,
  IllustrationType,
  IllustrationWarning,
  InformationType,
  LumpSumAmountType,
  MatchType,
  PensionGroup,
  PensionOrigin,
  PensionsCategory,
  PensionStatus,
  PensionType,
  RecurringAmountType,
  RetrievalStatus,
  UnavailableReason,
  UsageType,
} from '../constants';

export type ErrorResponse = {
  error: string;
  message: string;
};

export type PensionData = {
  pensionPolicies: PensionPolicy[];
  peiInformation: PeiInformationModel;
  pensionsDataRetrievalComplete: boolean;
  predictedTotalDataRetrievalTime: number;
  predictedRemainingDataRetrievalTime: number;
};

type PensionPolicy = {
  pensionArrangements: PensionArrangement[];
};

export type PensionArrangement = {
  externalPensionPolicyId: string;
  externalAssetId: string;
  matchType: MatchType;
  schemeName: string;
  alternateSchemeNames?: AlternateScheme[];
  contactReference?: string;
  pensionType: PensionType;
  pensionOrigin?: PensionOrigin;
  pensionStatus?: PensionStatus;
  pensionCategory?: PensionsCategory;
  hasIncome?: boolean;
  startDate?: string;
  group?: PensionGroup;
  retirementDate?: string;
  dateOfBirth?: string;
  statePensionMessageEng?: string;
  statePensionMessageWelsh?: string;
  contributionsFromMultipleEmployers: boolean;
  pensionAdministrator: PensionAdministrator;
  employmentMembershipPeriods?: EmploymentMembershipPeriod[];
  benefitIllustrations?: BenefitIllustration[];
  additionalDataSources?: AdditionalDataSource[];
  linkedPensions?: LinkedPension[];
  detailData?: DetailData;
};

type AlternateScheme = {
  name: string;
  alternateNameType: AlternateNameType;
};

export type PensionAdministrator = {
  name: string;
  contactMethods: ContactMethod[];
};

export type ContactMethod = {
  preferred: boolean;
  contactMethodDetails: EmailAddress | PhoneNumber | PostalAddress | Website;
};

export type EmploymentMembershipPeriod = {
  employerName: string;
  employerStatus: EmployerStatus;
  membershipStartDate: string;
  membershipEndDate: string;
};

export type BenefitIllustration = {
  illustrationComponents: BenefitIllustrationComponent[];
  illustrationDate: string;
};

export type AdditionalDataSource = {
  url: string;
  informationType: InformationType;
};

type PeiInformationModel = {
  peiRetrievalComplete: boolean;
  peiData: PeiData[];
};

type PeiData = {
  pei: string;
  description: string;
  retrievalStatus: RetrievalStatus;
};

export type EmailAddress = {
  email: string;
};

export type PhoneNumber = {
  number: string;
  usage: UsageType[];
};

export type PostalAddress = {
  postalName: string;
  line1: string;
  line2?: string;
  line3?: string;
  line4?: string;
  line5?: string;
  postcode: string;
  countryCode: string;
};

export type Website = {
  url: string;
};

export type BenefitIllustrationComponent = {
  illustrationType: IllustrationType;
  unavailableReason?: UnavailableReason;
  benefitType: BenefitType;
  calculationMethod: CalculationMethod;
  payableDetails: PayableDetails;
  dcPot?: number;
  survivorBenefit?: boolean;
  safeguardedBenefit?: boolean;
  illustrationWarnings?: IllustrationWarning[];
};

type PayableDetails =
  | RecurringIncomeDetails
  | LumpSumDetails
  | AmountNotProvidedDetails;

export type RecurringIncomeDetails = {
  amountType: RecurringAmountType;
  annualAmount: number;
  monthlyAmount: number;
  lastPaymentDate?: string;
  payableDate: string;
  increasing: boolean;
};

export type LumpSumDetails = {
  amountType: LumpSumAmountType;
  amount: number;
  payableDate: string;
};

export type AmountNotProvidedDetails = {
  reason: AmountNotProvidedReason;
  payableDate: string;
  lastPaymentDate?: string;
};

export type PensionsOverviewModel = {
  totalPensions: number;
  greenPensions: PensionArrangement[];
  greenPensionsNoIncome: PensionArrangement[];
  redPensions: PensionArrangement[];
  yellowPensions: PensionArrangement[];
  unsupportedPensions: PensionArrangement[];
};

export type PostResponseType = {
  requestId: string;
  rqp: string;
  scope: string;
  responseType: string;
  prompt: string;
  service: string;
  codeChallengeMethod: string;
  codeChallenge: string;
  codeVerifier: string;
  redirectTargetUrl: string;
};

export type ClaimsGatheringResponseType = {
  claimsRedirectUrl: string;
  rqp: string;
  ticket: string;
  requestId: string;
};

export type PensionsDataLoadTimes = {
  expectedTime: number;
  remainingTime: number;
};

export type Redirect = {
  redirect: { destination: string; permanent: boolean };
};

export type PensionTotals = { monthlyTotal: number; annualTotal: number };

export type UserSession = {
  userSessionId: string;
  authorizationCode: string;
  scenarioEndPoint?: string;
  sessionStart?: string;
};

export type GetPensionDataType = {
  userSession: UserSession;
  skipErrors?: boolean;
};

export type LinkedPension = {
  externalAssetId: string;
  schemeName: string;
  pensionType: PensionType;
  pensionCategory: PensionsCategory;
  hasIncome: boolean;
};

export type CardData = {
  monthlyAmount?: number;
  retirementDate?: string;
  unavailableReason?: string;
};

export type SummaryData = {
  monthlyTotal: number;
  annualTotal: number;
  statePensionDate: string;
};

export type TimelineArrangement = {
  id: string;
  schemeName: string;
  pensionType: PensionType;
  monthlyAmount?: number;
  startYear: number;
  endYear?: number;
  lumpSumAmount?: number;
  lumpSumYear?: number;
};

export type TimelineYear = {
  year: number;
  monthlyTotal: number;
  annualTotal: number;
  arrangements: TimelineArrangement[];
};

export type TimelineKey = PensionType | 'LU';

export type DetailData = {
  retirementDate?: string;
  illustrationDate?: string;
  warnings: IllustrationWarning[];
  monthlyAmount?: number;
  potValue?: number;
  lumpSumAmount?: number;
  lumpSumPayableDate?: string;
  benefitType?: BenefitType;
  unavailableCode?: string;
  incomeAndValues?: IncomeValues[];
};

export type IncomeValues = {
  bar: ChartIllustration;
  donut?: ChartIllustration;
};

export type ChartIllustration = {
  eri: ChartData;
  ap: ChartData;
  illustrationDate?: string;
};

export type ChartData = {
  monthlyAmount?: number;
  annualAmount?: number;
  amount?: number;
  payableDate?: string;
  benefitType?: BenefitType;
  calculationMethod?: CalculationMethod;
  increasing?: boolean;
  safeguardedBenefit: boolean;
  survivorBenefit: boolean;
  warnings: IllustrationWarning[];
};
