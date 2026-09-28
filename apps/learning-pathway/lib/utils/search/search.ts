import { DetailsPagesListModel } from 'lib/types/site.type';

import { DocSearchEntry } from '@maps-react/mps/utils/search';

export const prepareSearchData = (
  cards: DetailsPagesListModel[],
): Map<string, DocSearchEntry> => {
  const cardEntries = cards.map(
    ({
      slug,
      pageTitle,
      overview,
      description,
      preRequisiteSection,
      individualCertification,
      outcomeTitle,
      outcomesSection,
    }) => {
      const titleText = pageTitle.toLocaleLowerCase() ?? '';
      const overviewText = overview?.plaintext?.toLocaleLowerCase() ?? '';
      const sectionsText = [
        description?.plaintext ?? '',
        preRequisiteSection?.plaintext ?? '',
        individualCertification?.plaintext ?? '',
        outcomeTitle,
        outcomesSection?.plaintext ?? '',
      ]
        .join(' ')
        .toLocaleLowerCase();

      const combinedText = [titleText, overviewText, sectionsText].join(' ');

      return [
        slug,
        {
          titleText,
          overviewText,
          sectionsText,
          combinedText,
        } satisfies DocSearchEntry,
      ] as const;
    },
  );

  return new Map<string, DocSearchEntry>(cardEntries);
};
