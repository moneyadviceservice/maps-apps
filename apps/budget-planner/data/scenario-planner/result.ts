import { Node } from '@maps-react/vendor/utils/RenderRichText';

type QuestionsConditions = Record<string, string[]>;

type Conditions = QuestionsConditions & {
  __typename: 'SpconditionalresultconditionModel';
};

type JsonRichText = {
  json: Node[];
};

export type Section = {
  title_en: string;
  title_cy: string;
  description_en: JsonRichText | null;
  description_cy: JsonRichText | null;
  spCondition: Conditions;
  __typename: 'ConditionalresultsectionModel';
};

export type Result = {
  label_en: string;
  label_cy: string;
  description_en: JsonRichText | null;
  description_cy: JsonRichText | null;
  sections: Array<Section> | null;
  __typename: 'ConditionalresultModel';
};
