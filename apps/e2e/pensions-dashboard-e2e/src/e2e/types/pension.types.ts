// TODO: Review which ones are being used and remove redundant types.

// MHPD Response Schemas

export interface PayableDetails {
  amountType: string;
  annualAmount: number;
  payableDate: string;
  monthlyAmount: number;
  lastPaymentDate?: string;
  increasing?: boolean;
  reason?: string;
}

export interface IllustrationComponent {
  survivorBenefit: boolean;
  safeguardedBenefit: boolean;
  benefitType: string;
  calculationMethod?: string;
  payableDetails: PayableDetails;
  illustrationType: string;
  dcPot: number;
  unavailableReason?: string;
  illustrationWarnings?: string[];
}

export interface ContactMethodDetails {
  url?: string;
  email?: string;
  number?: string;
}

export interface PensionAdministrator {
  name: string;
  contactMethods: ContactMethod[];
}

export interface AdditionalDataSource {
  url: string;
  informationType: string;
}

export interface PensionArrangement {
  externalAssetId: string;
  schemeName: string;
  matchType: string;
  retirementDate: string;
  dateOfBirth: string;
  pensionType: string;
  statePensionMessageEng: string;
  statePensionMessageWelsh: string;
  contactReference: string;
  benefitIllustrations: BenefitIllustration[];
  pensionAdministrator: PensionAdministrator;
  additionalDataSources: AdditionalDataSource[];
}

export interface PensionResponse {
  pensionPolicies: Array<{
    pensionArrangements: Array<PensionArrangement>;
  }>;
  isPensionRetrievalComplete: boolean;
  peiInformation: {
    peiData: Array<unknown>;
    peiRetrievalComplete: boolean;
  };
}

// Utility Types

export interface AuthRequest {
  clientId: string;
  clientSecret: string;
  authorisationCode: string;
  redirectUrl: string;
  codeVerifier: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  predictedTotalDataRetrievalTime: number;
  statusCode: number;
}

export interface GetPensionsParams {
  userId: string;
  year?: number;
  status?: string;
}

export interface Pension {
  id: string;
  planName: string;
  value: number;
  status: string;
}

export type ApiError = {
  message: string;
  statusCode?: number;
  data?: unknown;
};

export interface PayableDetails {
  amountType: string;
  annualAmount: number;
  payableDate: string;
  monthlyAmount: number;
  lastPaymentDate?: string;
}

export interface IllustrationComponent {
  survivorBenefit: boolean;
  safeguardedBenefit: boolean;
  benefitType: string;
  calculationMethod?: string;
  payableDetails: PayableDetails;
  illustrationType: string;
  dcPot: number;
}

export interface ContactMethodDetails {
  url?: string;
  email?: string;
  number?: string;
}

export interface ContactMethod {
  preferred: boolean;
  contactMethodDetails: ContactMethodDetails;
}

export interface PensionAdministrator {
  name: string;
  contactMethods: ContactMethod[];
}

export interface AdditionalDataSource {
  url: string;
  informationType: string;
}

export type PensionCardType = string;

export interface pensionPolicies {
  externalAssetId: string;
  schemeName: string;
  matchType: string;
  retirementDate: string;
  dateOfBirth: string;
  pensionType: string;
  statePensionMessageEng: string;
  statePensionMessageWelsh: string;
  contactReference: string;
  benefitIllustrations: BenefitIllustration[];
  pensionAdministrator: PensionAdministrator;
  additionalDataSources: AdditionalDataSource[];
  pensionCardType: PensionCardType[];
}

////
export interface PensionData {
  id: string;
  correlationId: string;
  pei: string;
  pensionsRetrievalRecordId: string;
  pensionType: string;
  matchType: string;
  assetId: string;
  category: 'CONFIRMED' | 'PENDING' | 'CONTACT' | 'UNSUPPORTED';
  schemeName: string;
  hasIncome: 'true' | 'false';
  administratorName: string;
  retrievalResult: RetrievalResult[];
}

export interface RetrievalResult {
  externalAssetId: string;
  schemeName: string;
  matchType: string;
  retirementDate?: string;
  dateOfBirth?: string;
  pensionType: string;
  pensionOrigin?: string;
  pensionStatus?: string;
  contactReference?: string;
  startDate?: string;
  pensionAdministrator?: PensionAdministrator;
  employmentMembershipPeriods?: EmploymentMembershipPeriod[];
  pensionCategory: 'CONFIRMED' | 'PENDING' | 'CONTACT' | 'UNSUPPORTED';
  hasIncome?: boolean;
  benefitIllustrations?: BenefitIllustration[];
  additionalDataSources?: AdditionalDataSource[];
}

export interface AdditionalDataSource {
  url: string;
  informationType: string;
}

export interface PensionAdministrator {
  name: string;
  contactMethods: ContactMethod[];
}

export interface EmploymentMembershipPeriod {
  employerName: string;
  employerStatus: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
}

export interface BenefitIllustration {
  illustrationComponents?: IllustrationComponent[];
  illustrationDate?: string;
  illustrationCategory: 'CONFIRMED' | 'PENDING' | 'CONTACT' | 'UNSUPPORTED';
}
