import { addObjectKeyPrefix } from './addObjectKeyPrefix';

describe('addObjectKeyPrefix', () => {
  it('should add the specified prefix to each key in the form data object', () => {
    const formData = {
      key1: 'value1',
      key2: 'value2',
    };
    const prefix = 'q-';

    const result = addObjectKeyPrefix(formData, prefix);

    expect(result).toEqual({
      'q-key1': 'value1',
      'q-key2': 'value2',
    });
  });

  it('should handle empty form data', () => {
    const formData = {};
    const prefix = 'q-';

    const result = addObjectKeyPrefix(formData, prefix);

    expect(result).toEqual({});
  });

  it('should handle null form data', () => {
    const formData = null;
    const prefix = 'q-';

    const result = addObjectKeyPrefix(formData, prefix);

    expect(result).toEqual({});
  });
});
