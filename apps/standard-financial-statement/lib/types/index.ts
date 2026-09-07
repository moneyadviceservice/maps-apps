import { FormFlowType } from 'data/form-data/org_signup';
import { IronSession, IronSessionData } from 'iron-session';

export interface Entry {
  data: EntryData;
  errors: FormError[];
  continuation_token?: string;
}

export type EntryData = {
  lang?: string;
  flow?: FormFlowType;
  organisationName?: string;
  organisationWebsite?: string;
  organisationStreet?: string;
  organisationCity?: string;
  organisationPostcode?: string;
  sfsLaunchDate?: Date | string;
  caseManagementSoftware?: string;
  geoRegions?: string[];
  debtAdvice?: string[];
  sfslive?: string;
  organisationType?: string;
  organisationTypeOther?: string;
  organisationUse?: string;
  fcaReg?: string;
  fcaRegNumber?: string;
  debtAdviceDelivery?: string[];
  memberships?: string[];
  debtAdviceOther?: string;
  [key: string]: any;
};

export type FormError = {
  field: string;
  type: string;
};

type Redirect = {
  redirect: { destination: string; permanent: boolean };
};

export type RedirectOrSession = IronSession<IronSessionData> | Redirect;
