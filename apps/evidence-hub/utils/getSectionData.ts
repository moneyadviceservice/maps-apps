import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

type SectionInput = JsonRichText | { plaintext: string };

type SectionData = {
  header: {
    text: string;
    id: string;
  };
  json: JsonRichText['json'];
};

export const getSectionData = (
  sections: SectionInput[] | undefined,
): SectionData[] => {
  if (!sections) return [];

  const richTextSections = sections.filter(
    (sec): sec is JsonRichText => 'json' in sec,
  );

  return richTextSections.map((sec) => {
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
