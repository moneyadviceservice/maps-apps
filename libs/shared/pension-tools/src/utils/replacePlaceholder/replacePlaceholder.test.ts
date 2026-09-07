import { replacePlaceholder } from './replacePlaceholder';

describe('tests replacePlaceholder', () => {
  it('replaces key in string with value', () => {
    const string = 'A lazy {animal} took a stroll through the woods';
    const injectedString = replacePlaceholder('animal', 'dog', string);

    expect(injectedString).toEqual(
      'A lazy dog took a stroll through the woods',
    );
  });
});
