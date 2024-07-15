export type ErrorResponse = {
  error: string;
  message: string;
};

export type PensionData = {
  pensionPolicies: PensionPolicy[];
  peiInformation: PeiInformationModel;
  pensionsDataRetrievalComplete: boolean;
};

type PensionPolicy = {
  pensionArrangements: PensionArrangement[];
};

export type PensionArrangement = {
  externalPensionPolicyId: string;
  externalAssetId: string;
  matchType: 'DEFN' | 'POSS' | 'CONT' | 'NEW' | 'SYS';
  schemeName: string;
  alternateSchemeNames?: AlternateScheme[];
  contactReference: string;
  pensionType: 'AVC' | 'CB' | 'CDC' | 'DB' | 'DC' | 'HYB' | 'SP';
  pensionOrigin?: 'A' | 'PC' | 'PM' | 'PT' | 'WC' | 'WM' | 'WT';
  pensionStatus?: 'A' | 'I' | 'IPPF' | 'IWU';
  startDate?: string;
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
  alternateNameType: 'FOR' | 'OTH';
};

type PensionAdministrator = {
  name: string;
  contactMethods: ContactMethod[];
};

type ContactMethod = {
  preferred: boolean;
  contactMethodDetails: EmailAddress | PhoneNumber | PostalAddress | Website;
};

type EmploymentMembershipPeriod = {
  employerName: string;
  employerStatus: 'C' | 'H';
  membershipStartDate: string;
  membershipEndDate: string;
};

type BenefitIllustration = {
  illustrationComponents: BenefitIllustrationComponent[];
  illustrationDate: string;
};

type AdditionalDataSource = {
  url: string;
  informationType: 'C_AND_C' | 'SIP' | 'IMP' | 'ANR' | 'SP';
};

type PeiInformationModel = {
  peiRetrievalComplete: boolean;
  peiData: PeiData[];
};

type PeiData = {
  pei: string;
  description: string;
  retrievalStatus:
    | 'NEW'
    | 'RETRIEVAL_REQUESTED'
    | 'RETRIEVAL_COMPLETE'
    | 'RETRIEVAL_FAILED';
};

type EmailAddress = {
  email: string;
};

type PhoneNumber = {
  number: string;
  usage: ('A' | 'M' | 'N' | 'S' | 'W')[];
};

type PostalAddress = {
  postalName: string;
  line1: string;
  line2?: string;
  line3?: string;
  line4?: string;
  line5?: string;
  postcode: string;
  countryCode: string;
};

type Website = {
  url: string;
};

type BenefitIllustrationComponent = {
  illustrationType: 'ERI' | 'AP';
  unavailableReason?:
    | 'ANO'
    | 'DB'
    | 'DBC'
    | 'DCC'
    | 'DCHA'
    | 'DCHP'
    | 'DCSM'
    | 'MEM'
    | 'NEW'
    | 'NET'
    | 'PPF'
    | 'TRN'
    | 'WU';
  benefitType: 'AVC' | 'CBL' | 'CBS' | 'CDI' | 'CDL' | 'DB' | 'DBL' | 'DC';
  calculationMethod: 'BS' | 'CBI' | 'SMPI';
  payableDetails: PayableDetails;
  dcPot?: number;
  survivorBenefit?: boolean;
  safeguardedBenefit?: boolean;
  illustratonWarnings?: (
    | 'AVC'
    | 'CUR'
    | 'DEF'
    | 'FAS'
    | 'PEO'
    | 'PNR'
    | 'PSO'
    | 'SPA'
    | 'TVI'
    | 'INP'
  )[];
};

type PayableDetails =
  | RecurringIncomeDetails
  | LumpSumDetails
  | AmountNotProvidedDetails;

type RecurringIncomeDetails = {
  amountType: 'INC' | 'INCL' | 'INCN';
  annualAmount: number;
  monthlyAmount: number;
  lastPaymentDate?: string;
  payableDate: string;
  increasing: boolean;
};

type LumpSumDetails = {
  amountType: 'CSH' | 'CSHL' | 'CSHN';
  amount: number;
  payableDate: string;
};

type AmountNotProvidedDetails = {
  reason: 'SML';
  payableDate: string;
  lastPaymentDate?: string;
};

export type PensionsOverviewModel = {
  totalPensions: number;
  confirmedPensions: PensionArrangement[];
  unconfirmedPensions: PensionArrangement[];
  incompletePensions: PensionArrangement[];
};
