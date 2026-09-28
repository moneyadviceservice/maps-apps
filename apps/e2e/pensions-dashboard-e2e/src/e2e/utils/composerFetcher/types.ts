export interface ComposerGetResponse {
  data: Data;
}

export interface Data {
  testScenarioCode: string;
  dataPoints: DataPoint[];
}

export interface DataPoint {
  availableAt: number;
  pensionsData: PensionsData;
}

export interface PensionsData {
  pensionPolicies: PensionPolicy[];
  pensionsDataRetrievalComplete: boolean;
  predictedTotalDataRetrievalTime: number;
  predictedRemainingDataRetrievalTime: number;
}

export interface PensionPolicy {
  pensionArrangements: PensionArrangement[];
}

export interface PensionArrangement {
  externalAssetId: string;
  schemeName: string;
  matchType: string;
  retirementDate: Date;
  dateOfBirth: Date;
  pensionType: string;
  statePensionMessageEng?: string;
  statePensionMessageWelsh?: string;
  contactReference: string;
  startDate: Date;
  benefitIllustrations?: BenefitIllustration[];
  pensionAdministrator: PensionAdministrator;
  additionalDataSources?: AdditionalDataSource[];
  pensionOrigin?: string;
  pensionStatus?: string;
  employmentMembershipPeriods?: EmploymentMembershipPeriod[];
}

export interface AdditionalDataSource {
  informationType: string;
  url: string;
}

export interface BenefitIllustration {
  illustrationDate: Date;
  illustrationComponents: IllustrationComponent[];
}

export interface IllustrationComponent {
  illustrationType: IllustrationType;
  survivorBenefit: boolean;
  safeguardedBenefit: boolean;
  payableDetails?: PayableDetails;
  benefitType?: string;
  calculationMethod?: string;
  unavailableReason?: string;
}

export enum IllustrationType {
  Ap = 'AP',
  Eri = 'ERI',
}

export interface PayableDetails {
  amountType?: string;
  annualAmount?: number;
  payableDate: Date;
  monthlyAmount?: number;
  lastPaymentDate?: Date;
  reason?: string;
}

export interface EmploymentMembershipPeriod {
  employerName: string;
  employerStatus: string;
  membershipStartDate: Date;
  membershipEndDate?: Date;
}

export interface PensionAdministrator {
  name: string;
  contactMethods: ContactMethod[];
}

export interface ContactMethod {
  preferred: boolean;
  contactMethodDetails: ContactMethodDetails;
}

export interface ContactMethodDetails {
  url?: string;
  email?: string;
  usage?: string[];
  number?: string;
  postalName?: string;
  line1?: string;
  line2?: string;
  postcode?: string;
  countryCode?: string;
  line3?: string;
}
