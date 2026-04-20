import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

type SectionData = {
  header: {
    text: string;
    id: string;
  };
  json: JsonRichText['json'];
};

export const getSectionData = (
  sections: JsonRichText[] | undefined,
): SectionData[] => {
  if (!sections) return [];

  return sections.map((sec) => {
    const header = sec.json?.find(
      (json) => json?.nodeType === 'header' && json.style === 'h2',
    );
    const heading = header?.content
      ?.map((content) => content?.value)
      ?.join(' ');

    return {
      header: {
        text: heading ?? '',
        id: heading?.replaceAll(/\s/g, '') ?? '',
      },
      json:
        sec?.json?.filter(
          (json) => !(json?.nodeType === 'header' && json?.style === 'h2'),
        ) || [],
    };
  });
};
