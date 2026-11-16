import { FormData, TabData } from '../../../types/forms';
import { tabDataTransformer } from './tabDataTransformer';

describe('tabDataTransformer', () => {
  const formData: FormData = {
    field1: '10',
    field2: '20',
    field3: '30',
    'field4-i': '10',
    'field4-s': '1',
  };

  const tabs: TabData[] = [
    {
      linkText: 'Tab 1',
      heading: 'Heading 1',
      content: 'Content string',
      summary: { label: 'Summary 1', unit: 'pounds', calc: 'exclude' },
      fields: [
        {
          key: 'field1',
          label: 'Field 1',
          type: 'select',
          defaultSelectValue: '',
        },
        {
          key: 'field2',
          label: 'Field 2',
          type: 'input-currency',
          defaultInputValue: '',
        },
        {
          key: 'field4',
          label: 'Field 4',
          type: 'input-currency',
          defaultInputValue: '',
        },
      ],
    },
    {
      linkText: 'Tab 2',
      heading: 'Heading 2',
      content: 'Content string',
      summary: { label: 'Summary 2', unit: 'pounds', calc: 'add' },
      fields: [
        {
          key: 'field2',
          label: 'Field 2',
          type: 'input-currency',
          defaultInputValue: '',
        },
        {
          key: 'field3',
          label: 'Field 3',
          type: 'input-currency',
          defaultInputValue: '',
        },
      ],
    },
    {
      linkText: 'Tab 3',
      heading: 'Heading 3',
      content: 'Content string',
      summary: { label: 'Summary 3', unit: 'pounds', calc: 'sub' },
      fields: [
        {
          key: 'field4',
          label: 'Field 4',
          type: 'input-currency-with-select',
          defaultInputValue: '',
          defaultSelectValue: '',
        },
      ],
    },
  ];

  const expectedOutput = {
    tabLinks: ['Tab 1', 'Tab 2', 'Tab 3'],
    tabContentHeadings: ['Heading 1', 'Heading 2', 'Heading 3'],
    fieldData: {
      defaultValues: { field1: '', field4: '' },
      acdlErrors: {},
      groupedFieldItems: [
        {
          name: 'Tab 3',
          url: 'urlstring3?q-field1=10&q-field2=20&q-field3=30&q-field4-i=10&q-field4-s=1#Tab-3',
          value: 300,
        },
      ],
      summaryItems: [
        {
          label: 'Summary 1',
          value: 30,
          unit: 'pounds',
          calc: 'exclude',
          hasUserData: true,
        },
        {
          label: 'Summary 2',
          value: 50,
          unit: 'pounds',
          calc: 'add',
          hasUserData: true,
        },
        {
          label: 'Summary 3',
          value: 300,
          unit: 'pounds',
          calc: 'sub',
          hasUserData: true,
        },
      ],
      validation: [{}, {}, {}],
      conditionalFields: new Set(),
    },
  };

  it('should transform tab data correctly', () => {
    const result = tabDataTransformer(formData, tabs, 'urlstring');
    expect(result).toEqual(expectedOutput);
  });

  it('should handle empty formData and tabs', () => {
    const emptyFormData: FormData = {};
    const emptyTabs: TabData[] = [];
    const expectedEmptyOutput = {
      tabLinks: [],
      tabContentHeadings: [],
      fieldData: {
        defaultValues: {},
        acdlErrors: {},
        groupedFieldItems: [],
        summaryItems: [],
        validation: [],
        conditionalFields: new Set(),
      },
    };
    const result = tabDataTransformer(emptyFormData, emptyTabs, 'urlstring');
    expect(result).toEqual(expectedEmptyOutput);
  });

  it('should handle tabs without formData keys', () => {
    const tabsWithoutFormData: TabData[] = [
      {
        linkText: 'Tab 3',
        heading: 'Heading 3',
        content: 'content string',
        summary: { label: 'Summary 3', unit: 'pounds' },
        fields: [
          {
            key: 'field5',
            label: 'Field 5',
            type: 'input-currency',
            defaultInputValue: '',
          },
        ],
      },
    ];
    const expectedOutputWithoutFormData = {
      tabLinks: ['Tab 3'],
      tabContentHeadings: ['Heading 3'],
      fieldData: {
        defaultValues: {},
        acdlErrors: {},
        groupedFieldItems: [],
        summaryItems: [
          {
            label: 'Summary 3',
            unit: 'pounds',
            value: 0,
            calc: undefined,
            hasUserData: false,
          },
        ],
        validation: [{}],
        conditionalFields: new Set(),
      },
    };
    const result = tabDataTransformer(
      formData,
      tabsWithoutFormData,
      'urlstring',
    );
    expect(result).toEqual(expectedOutputWithoutFormData);
  });

  it('should handle input with connected select field', () => {
    const formDataIS: FormData = {
      'field-i': '20',
      'field-s': '30',
    };

    const tabsIS: TabData[] = [
      {
        linkText: 'Tab',
        heading: 'Heading',
        content: 'Content',
        summary: { label: 'Summary 1', unit: 'pounds' },
        fields: [
          {
            key: 'field',
            label: 'Field',
            type: 'input-currency-with-select',
            defaultInputValue: '',
            defaultSelectValue: '',
          },
        ],
      },
    ];

    const expectedOutputIS = {
      tabLinks: ['Tab'],
      tabContentHeadings: ['Heading'],
      fieldData: {
        defaultValues: { field: '' },
        acdlErrors: {},
        groupedFieldItems: [],
        summaryItems: [
          {
            label: 'Summary 1',
            value: 20,
            unit: 'pounds',
            calc: undefined,
            hasUserData: true,
          },
        ],
        validation: [{}],
        conditionalFields: new Set(),
      },
    };

    const result = tabDataTransformer(formDataIS, tabsIS, 'urlstring');
    expect(result).toEqual(expectedOutputIS);
  });
});
