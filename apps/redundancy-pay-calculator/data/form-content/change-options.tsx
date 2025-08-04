import useTranslation from '@maps-react/hooks/useTranslation';

export enum Section {
  CheckAnswers = 0,
  ChangeAnswersNextPageText = 1,
}

export const redundancyPayCalculatorText = (
  z: ReturnType<typeof useTranslation>['z'],
  section: Section,
): string => {
  switch (section) {
    case Section.CheckAnswers: {
      return z({
        en: "This is what you've told us. Please make any changes to your answers if you need to.",
        cy: "Dyma beth rydych chi wedi'i ddweud wrthym. Gwnewch unrhyw newidiadau i'ch atebion os oes angen.",
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
