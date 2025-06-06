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
  startDate?: string;
  group?:
    | PensionGroup.GREEN
    | PensionGroup.GREEN_NO_INCOME
    | PensionGroup.RED
    | PensionGroup.YELLOW;
  retirementDate?: string;
  dateOfBirth?: string;
  statePensionMessageEng?: string;
  statePensionMessageWelsh?: string;
  contributionsFromMultipleEmployers: boolean;
  pensionAdministrator: PensionAdministrator;
  employmentMembershipPeriods?: EmploymentMembershipPeriod[];
  benefitIllustrations?: BenefitIllustration[];
  additionalDataSources?: AdditionalDataSource[];
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

export type PensionTotals = { monthlyTotal: number; annualTotal: number };
