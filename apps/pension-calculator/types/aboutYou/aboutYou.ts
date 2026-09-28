export const SEX_MALE = 'male';
export const SEX_FEMALE = 'female';

export type SexValue = typeof SEX_MALE | typeof SEX_FEMALE | '';

export type AboutYouData = {
  day: string;
  month: string;
  year: string;
  sex: SexValue;
  retireAge: string;
};

export type AboutYouErrors = Record<string, string[]>;

export const defaultAboutYouData = (): AboutYouData => ({
  day: '',
  month: '',
  year: '',
  sex: '',
  retireAge: '',
});
