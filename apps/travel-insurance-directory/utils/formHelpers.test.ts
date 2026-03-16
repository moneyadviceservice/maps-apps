import {
  convertFormDataToObject,
  parseListingsRequestBody,
} from './formHelpers';

describe('convertFormDataToObject', () => {
  it('converts single string entries to object', () => {
    const formData = new FormData();
    formData.set('topic', 'medical');
    formData.set('age', '30');
    expect(convertFormDataToObject(formData)).toEqual({
      topic: 'medical',
      age: '30',
    });
  });

  it('trims whitespace from values', () => {
    const formData = new FormData();
    formData.set('key', '  value  ');
    expect(convertFormDataToObject(formData)).toEqual({ key: 'value' });
  });

  it('omits empty string after trim', () => {
    const formData = new FormData();
    formData.set('empty', '   ');
    formData.set('filled', 'x');
    expect(convertFormDataToObject(formData)).toEqual({ filled: 'x' });
  });

  it('handles array keys with [] suffix', () => {
    const formData = new FormData();
    formData.append('topic[]', 'a');
    formData.append('topic[]', 'b');
    const result = convertFormDataToObject(formData);
    expect(result['topic[]']).toEqual(['a', 'b']);
  });

  it('combines multiple values for same key when not array key', () => {
    const formData = new FormData();
    formData.append('key', 'first');
    formData.append('key', 'second');
    const result = convertFormDataToObject(formData);
    expect(result.key).toBe('first');
  });

  it('ignores non-string entries', () => {
    const formData = new FormData();
    formData.set('name', 'test');
    formData.append('file', new Blob(['x']) as unknown as File, 'file.txt');
    const result = convertFormDataToObject(formData);
    expect(result.name).toBe('test');
    expect(result.file).toBeUndefined();
  });
});

describe('parseListingsRequestBody', () => {
  it('converts body to same shape as form data object', () => {
    const body = { topic: 'medical', age: '30' };
    expect(parseListingsRequestBody(body)).toEqual({
      topic: 'medical',
      age: '30',
    });
  });

  it('skips undefined values', () => {
    const body = { a: 'x', b: undefined, c: 'y' };
    expect(parseListingsRequestBody(body)).toEqual({ a: 'x', c: 'y' });
  });

  it('handles array values (non-array key takes first value)', () => {
    const body = { topic: ['a', 'b'] };
    expect(parseListingsRequestBody(body)).toEqual({ topic: 'a' });
  });

  it('trims and filters empty in arrays', () => {
    const body = { topic: ['  ', 'x', ''] };
    expect(parseListingsRequestBody(body)).toEqual({ topic: 'x' });
  });

  it('handles array key with [] suffix', () => {
    const body = { 'topic[]': ['a', 'b'] };
    expect(parseListingsRequestBody(body)).toEqual({ 'topic[]': ['a', 'b'] });
  });
});
