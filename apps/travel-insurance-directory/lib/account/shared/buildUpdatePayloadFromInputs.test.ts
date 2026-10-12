import { buildUpdatePayloadFromInputs } from './buildUpdatePayloadFromInputs';

describe('buildUpdatePayloadFromInputs', () => {
  it('correctly prefixes all keys defined in inputs with the global updatePath', () => {
    const updatePath = 'users/123';
    const fields: Record<string, string | boolean> = {
      firstName: 'Alice',
      lastName: 'Smith',
      isActive: true,
    };

    const inputs = [
      { key: 'firstName' },
      { key: 'lastName' },
      { key: 'isActive' },
    ];

    const result = buildUpdatePayloadFromInputs(fields, inputs, updatePath);

    expect(result).toEqual({
      'users/123/firstName': 'Alice',
      'users/123/lastName': 'Smith',
      'users/123/isActive': true,
    });
  });

  it('sets missing fields to an empty string if they are absent from the fields object', () => {
    const updatePath = 'users/123';
    const fields: Record<string, string | boolean> = {
      firstName: 'Alice',
    };

    const inputs = [{ key: 'firstName' }, { key: 'lastName' }];

    const result = buildUpdatePayloadFromInputs(fields, inputs, updatePath);

    expect(result).toEqual({
      'users/123/firstName': 'Alice',
      'users/123/lastName': '',
    });
  });

  it('returns an empty object when the inputs array is empty', () => {
    const updatePath = 'settings/preferences';
    const fields: Record<string, string | boolean> = { theme: 'dark' };

    const result = buildUpdatePayloadFromInputs(fields, [], updatePath);

    expect(result).toEqual({});
  });

  it('handles an empty string for the updatePath', () => {
    const updatePath = '';
    const fields: Record<string, string | boolean> = {
      theme: 'dark',
      notificationsEnabled: false,
    };
    const inputs = [{ key: 'theme' }, { key: 'notificationsEnabled' }];

    const result = buildUpdatePayloadFromInputs(fields, inputs, updatePath);

    expect(result).toEqual({
      theme: 'dark',
      notificationsEnabled: false,
    });
  });

  it('overrides the global updatePath with specific dataPath from input config', () => {
    const updatePath = 'users';
    const fields: Record<string, string | boolean> = {
      first: 'Alice',
      last: 'Smith',
      isActive: true,
    };

    const inputs = [
      { key: 'first', dataPath: 'principal/name' },
      { key: 'last', dataPath: 'principal/name' },
      { key: 'isActive' },
    ];

    const result = buildUpdatePayloadFromInputs(fields, inputs, updatePath);

    expect(result).toEqual({
      'principal/name/first': 'Alice',
      'principal/name/last': 'Smith',
      'users/isActive': true,
    });
  });
});
