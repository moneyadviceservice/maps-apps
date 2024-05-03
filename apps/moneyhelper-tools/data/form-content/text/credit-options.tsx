import { useTranslation } from '@maps-digital/shared/hooks';

export enum Section {
  CheckAnswers = 0,
  ChangeAnswersNextPageText = 1,
}

export const creditOptionsText = (
  z: ReturnType<typeof useTranslation>['z'],
  section: Section,
): string => {
  switch (section) {
    case Section.CheckAnswers: {
      return z({
        en: 'This is what you’ve told us. You can change your answers if you need to.',
        cy: "Dyma beth rydych wedi'i ddweud wrthym. Gallwch newid eich atebion os ydych angen.",
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
