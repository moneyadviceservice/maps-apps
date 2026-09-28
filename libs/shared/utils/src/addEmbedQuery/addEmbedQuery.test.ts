import { addEmbedQuery } from './addEmbedQuery';

describe('addEmbedQuery function', () => {
  test('should add "?isEmbedded=true" query when isEmbed is true and queryChar is ?', () => {
    const result = addEmbedQuery(true, '?');
    expect(result).toBe('?isEmbedded=true');
  });

  test('should not add query when isEmbed is false', () => {
    const result = addEmbedQuery(false, '?');
    expect(result).toBe('');
  });

  test('should not add query when isEmbed is true and queryChar is empty', () => {
    const result = addEmbedQuery(true, '');
    expect(result).toBe('');
  });

  test('should add "&isEmbedded=true" query when isEmbed is true and queryChar is &', () => {
    const result = addEmbedQuery(true, '&');
    expect(result).toBe('&isEmbedded=true');
  });
});
