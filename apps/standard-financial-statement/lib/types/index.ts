import { FormType } from 'data/form-data/org_signup';
import { IronSession, IronSessionData } from 'iron-session';

export interface Entry {
  data: EntryData;
  errors: FormError[];
}

export type EntryData = {
  lang?: string;
  flow?: FormType;
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
