import { useTranslation } from '@maps-react/hooks/useTranslation';

export enum Section {
  CheckAnswers = 0,
  ChangeAnswersNextPageText = 1,
}

export const midLifeMotText = (
  z: ReturnType<typeof useTranslation>['z'],
  section: Section,
): string => {
  switch (section) {
    case Section.CheckAnswers: {
      return z({
        en: "This is what you've told us. Please make any changes to your answers if you need to, then click the button to get your personalised Money Midlife MOT report. Please note that changing some answers might bring up new questions you didn't answer before.",
        cy: "Dyma beth rydych wedi dweud wrthym. Gwnewch unrhyw newidiadau i'ch atebion os oes angen, yna cliciwch ar y botwm i gael eich adroddiad personol MOT Canol Oes Arian. Nodwch efallai y bydd newid rhai atebion yn creu cwestiynau newydd na wnaethoch ateb cynt.",
      });
    }
    case Section.ChangeAnswersNextPageText: {
      return z({
        en: 'Continue',
        cy: 'Parhau',
      });
    }
    default: {
      return '';
    }
  }
};
