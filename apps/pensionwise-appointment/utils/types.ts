import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

export type ToDoItem = {
  id: string;
  text: JsonRichText;
};

export type ToDoCard = {
  id: string;
  title: string;
  text: JsonRichText;
  duration: string;
};

export type PensionOption = PensionOptionDataType & {
  testId: string;
};

export type PensionOptionDataType = {
  title: string;
  items: ToDoItem[];
};

export type SummaryPageModel = {
  welcomeBackTitle: string;
  welcomeBackText: JsonRichText;
  heroTitle: string;
  heroContent: JsonRichText;
  title: string;
  introText: JsonRichText;
  optionsTitle: string;
  optionsIntro: string;
  optionsIntroLinkText: string;
  basicPlanningTitle: string;
  basicPlanningIntro: JsonRichText;
  basicPlanningToDoCards: ToDoCard[];
  optionalBasicPlanningToDoCards: ToDoCard[];
  retireLaterTitle: string;
  retireLaterToDoItems: ToDoItem[];
  guaranteedIncomeTitle: string;
  guaranteedIncomeToDoItems: ToDoItem[];
  flexibleIncomeTitle: string;
  flexibleIncomeToDoItems: ToDoItem[];
  lumpSumTitle: string;
  lumpSumToDoItems: ToDoItem[];
  potInOneGoTitle: string;
  potInOneGoToDoItems: ToDoItem[];
  printButtonText: string;
  mixingYourOptionsTitle: string;
  mixingYourOptionsToDoItems: ToDoItem[];
  saveTitle: string;
  saveText: JsonRichText;
  saveButtonText: string;
  printPageBanner?: string;
  bannerTextNonjs?: string;
};
export type ApptSaveModel = {
  title: string;
  slug: string;
  pageDescription: JsonRichText;
  labelText: string;
  labelSubText: string[];
  errorMessageEmail: string;
  errorMessageSend: string[];
  submitButtonText: string;
};

export type ApptSaveProps = {
  data: ApptSaveModel;
};
