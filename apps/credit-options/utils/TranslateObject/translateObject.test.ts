import { translateObject } from './translateObject';

const mockTranslationFunction = (obj: any) => {
  return obj['cy'];
};

describe('translateObject', () => {
  it('translates an object with translation objects correctly', () => {
    const input = {
      key1: { en: 'value1', cy: 'translatedValue1' },
      key2: { en: 'value2', cy: 'translatedValue2' },
    };

    const expectedOutput = {
      key1: 'translatedValue1',
      key2: 'translatedValue2',
    };

    expect(translateObject(input, mockTranslationFunction)).toEqual(
      expectedOutput,
    );
  });

  it('translates an array of objects with translation objects correctly', () => {
    const input = [
      { en: 'value1', cy: 'translatedValue1' },
      { en: 'value2', cy: 'translatedValue2' },
    ];

    const expectedOutput = ['translatedValue1', 'translatedValue2'];

    expect(translateObject(input, mockTranslationFunction)).toEqual(
      expectedOutput,
    );
  });

  it('does not modify non-translation objects', () => {
    const input = {
      key1: 'value1',
      key2: ['value2', 'value3'],
      key3: 123,
    };

    // Since there are no translation objects, the output should be the same as input
    expect(translateObject(input, mockTranslationFunction)).toEqual(input);
  });

  it('handles nested objects and arrays', () => {
    const input = {
      key1: { en: 'value1', cy: 'translatedValue1' },
      key2: [
        { en: 'value2', cy: 'translatedValue2' },
        { en: 'value3', cy: 'translatedValue3' },
      ],
      key3: {
        subkey1: { en: 'value4', cy: 'translatedValue4' },
        subkey2: ['value5', { en: 'value6', cy: 'translatedValue6' }],
      },
    };

    const expectedOutput = {
      key1: 'translatedValue1',
      key2: ['translatedValue2', 'translatedValue3'],
      key3: {
        subkey1: 'translatedValue4',
        subkey2: ['value5', 'translatedValue6'],
      },
    };

    expect(translateObject(input, mockTranslationFunction)).toEqual(
      expectedOutput,
    );
  });
});
