import { DataFromQuery } from '@maps-react/utils/pageFilter/pageFilter';

export type RetirementGuidanceIndex =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 'checkAnswers'
  | 'results';

export type ParsedRequest = {
  data: DataFromQuery;
  questionNumber: number;
  error: boolean;
};

export type ContentItem =
  | { type: 'markdown'; key: string; withIcon?: boolean }
  | { type: 'paragraph'; key: string }
  | {
      type: 'list';
      items: (
        | {
            type: 'listItem';
            key: string;
            sublist?: { key: string; noIcon?: boolean; insideIcon?: boolean }[];
          }
        | {
            type: 'markdownListItem';
            key: string;
            withIcon?: boolean;
            sublist?: { key: string; noIcon?: boolean; insideIcon?: boolean }[];
          }
      )[];
    }
  | { type: 'heading'; key: string };

export type EmploymentOutcome = {
  showEmployment02: boolean;
  showEmployment02a: boolean;
  showEmployment02b: boolean;
  showEmployment03: boolean;
  showEmployment04: boolean;
  showEmployment05: boolean;
  showEmployment06: boolean;
  showEmployment07: boolean;
};

export type HousingOutcome = {
  showHousing09: boolean;
  showHousing09a: boolean;
  showHousing10: boolean;
  showHousing10a: boolean;
  showHousing11: boolean;
  showHousing12: boolean;
  showHousing12a: boolean;
  showHousing13: boolean;
  showHousing14: boolean;
  showHousing14a: boolean;
  showHousing14b: boolean;
  showHousing15: boolean;
  showHousing15a: boolean;
  showHousing16: boolean;
  showHousing16a: boolean;
  showHousing16b: boolean;
};
