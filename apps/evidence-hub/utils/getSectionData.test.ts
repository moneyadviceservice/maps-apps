import { JsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { getSectionData } from './getSectionData';

describe('getSectionData', () => {
  // Shared test data
  const mockSectionWithHeader = (headerText: string, contentText: string) => ({
    json: [
      {
        nodeType: 'header',
        style: 'h2',
        content: [{ nodeType: 'text', value: headerText }],
      },
      {
        nodeType: 'paragraph',
        content: [{ nodeType: 'text', value: contentText }],
      },
    ],
  });

  const mockSectionWithoutHeader = (contentText: string) => ({
    json: [
      {
        nodeType: 'paragraph',
        content: [{ nodeType: 'text', value: contentText }],
      },
    ],
  });

  it.each([
    { input: undefined, description: 'sections is undefined' },
    { input: [], description: 'sections is empty' },
  ])('returns empty array when $description', ({ input }) => {
    const result = getSectionData(input);
    expect(result).toEqual([]);
  });

  it('processes sections with headers correctly', () => {
    const sections: JsonRichText[] = [
      mockSectionWithHeader('Section One', 'Content for section one'),
      mockSectionWithHeader('Section Two', 'Content for section two'),
    ];

    const result = getSectionData(sections);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      header: {
        text: 'Section One',
        id: 'SectionOne',
      },
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Content for section one' }],
        },
      ],
    });
    expect(result[1]).toEqual({
      header: {
        text: 'Section Two',
        id: 'SectionTwo',
      },
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Content for section two' }],
        },
      ],
    });
  });

  it('handles sections without headers', () => {
    const sections: JsonRichText[] = [
      mockSectionWithoutHeader('Content without header'),
    ];

    const result = getSectionData(sections);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      header: {
        text: '',
        id: '',
      },
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Content without header' }],
        },
      ],
    });
  });

  it('handles sections with empty header content', () => {
    const sections: JsonRichText[] = [
      {
        json: [
          {
            nodeType: 'header',
            style: 'h2',
            content: [],
          },
          {
            nodeType: 'paragraph',
            content: [{ nodeType: 'text', value: 'Content' }],
          },
        ],
      },
    ];

    const result = getSectionData(sections);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      header: {
        text: '',
        id: '',
      },
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Content' }],
        },
      ],
    });
  });

  it('handles sections with undefined json', () => {
    const sections = [
      {
        json: undefined,
      } as unknown as JsonRichText,
    ];

    const result = getSectionData(sections);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      header: {
        text: '',
        id: '',
      },
      json: [],
    });
  });

  it('filters out multiple headers from section content', () => {
    const sections: JsonRichText[] = [
      {
        json: [
          {
            nodeType: 'header',
            style: 'h2',
            content: [{ nodeType: 'text', value: 'First Header' }],
          },
          {
            nodeType: 'paragraph',
            content: [{ nodeType: 'text', value: 'Content' }],
          },
          {
            nodeType: 'header',
            style: 'h2',
            content: [{ nodeType: 'text', value: 'Second Header' }],
          },
        ],
      },
    ];

    const result = getSectionData(sections);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      header: {
        text: 'First Header',
        id: 'FirstHeader',
      },
      json: [
        {
          nodeType: 'paragraph',
          content: [{ nodeType: 'text', value: 'Content' }],
        },
      ],
    });
  });
});
