export type SearchItem = {
  title: string;
  description: string;
  link: string;
};

export type SearchResult = {
  results: SearchItem[];
  minLength: boolean;
  excludedWords: boolean;
};

export const excludedWords = [
  'the',
  'and',
  'are',
  'was',
  'were',
  'been',
  'being',
  'for',
  'with',
  'that',
  'this',
  'they',
];

export const excludedWordsWelsh = [
  'mae',
  'wedi',
  'gan',
  'hyn',
  'hwy',
  'hwyrach',
  'hynny',
];

export type SearchResultResponse = {
  title: string;
  slug: string;
  seoDescription: string;
  _path: string;
  loginMessage?: {
    loginIntro: {
      plaintext: string;
    };
  };
  content: {
    plaintext: string;
  }[];
  section: {
    plaintext: string;
  }[];
};
