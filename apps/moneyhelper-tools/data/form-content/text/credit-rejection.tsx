import { useTranslation } from '@maps-react/hooks/useTranslation';

export enum Section {
  CheckAnswers = 0,
  ChangeAnswersNextPageText = 1,
}

export const creditRejectionText = (
  z: ReturnType<typeof useTranslation>['z'],
  section: Section,
): string => {
  switch (section) {
    case Section.CheckAnswers: {
      return z({
        en: "This is what you've told us. Please make any changes to your answers if you need to.",
        cy: "Dyma beth rydych wedi'i ddweud wrthym. Gwnewch unrhyw newidiadau i'ch atebion os oes angen.",
      });
    }
    case Section.ChangeAnswersNextPageText: {
      return z({
        en: 'Get your action plan',
        cy: 'Cael eich cynllun gweithredu',
      });
    }
    default: {
      return '';
    }
  }
};
