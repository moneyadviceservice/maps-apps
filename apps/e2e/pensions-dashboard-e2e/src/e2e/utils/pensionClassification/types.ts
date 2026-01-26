export type PensionChannel = 'RED' | 'YELLOW' | 'GREEN' | 'UNSUPPORTED';

export type UnavailableAccruedAmountReason =
  | '' // No unavailable code, considered to have an amount, this will get normalised by the PensionClassification util.
  | 'ANO'
  | 'DBC'
  | 'DCC'
  | 'MEM'
  | 'NET'
  | 'NEW'
  | 'PPF'
  | 'TRN'
  | 'WU';

export type UnavailableERIReason =
  | UnavailableAccruedAmountReason
  | 'DB'
  | 'DCHA'
  | 'DCHP';

export type IllustrationDetails<PossibleUnavailableReason> = {
  componentExists: boolean;
  unavailableReason?: PossibleUnavailableReason;
  annualAmount?: number;
};

export interface ClassifiablePension {
  pensionType?: 'DB' | 'DC' | 'AVC' | 'CB' | 'CBC' | 'CDC' | 'HYB' | 'SP';
  pensionAdministrator: string;
  schemeName: string;
  matchType: 'DEFN' | 'POSS' | 'CONT' | 'NEW' | 'SYS';
  eriDetails: IllustrationDetails<UnavailableERIReason>;
  apDetails: IllustrationDetails<UnavailableAccruedAmountReason>;
}
