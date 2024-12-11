import { FormField } from 'data/types';
import { groupFormFields } from 'utils/TabToolUtils/groupFormFields';

describe('groupFormFields', () => {
  const mockFormFields: FormField[] = [
    {
      key: 'field1',
      label: 'Field 1',
      group: { key: 'group1', label: 'Group 1' },
      type: 'select',
      defaultSelectValue: '',
    },
    {
      key: 'field2',
      label: 'Field 2',
      group: { key: 'group2', label: 'Group 2' },
      type: 'input-currency',
      defaultInputValue: '',
    },
    {
      key: 'field3',
      label: 'Field 3',
      type: 'input-currency',
      defaultInputValue: '',
    },
  ];

  it('groups form fields by group key', () => {
    const result = groupFormFields(mockFormFields);

    expect(result).toHaveProperty('group1');
    expect(result['group1']).toHaveLength(1);
    expect(result['group1'][0].key).toBe('field1');

    expect(result).toHaveProperty('group2');
    expect(result['group2']).toHaveLength(1);
    expect(result['group2'][0].key).toBe('field2');

    expect(result).toHaveProperty('no-group');
    expect(result['no-group']).toHaveLength(1);
    expect(result['no-group'][0].key).toBe('field3');
  });

  it('handles empty input', () => {
    const result = groupFormFields([]);

    expect(result).toEqual({});
  });
});
