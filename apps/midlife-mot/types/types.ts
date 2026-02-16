export type Group = {
  title: string;
  group: string;
  descritionScoreOne?: string;
  descritionScoreTwo?: string;
  descritionScoreThree?: string;
};

export type Links = {
  title: string;
  link: string;
  type: string;
  description?: string;
};

export enum DataPath {
  MidLifeMot = 'midlife-mot',
}

export enum UrlPath {
  MidLifeMot = 'mid-life-mot',
}
