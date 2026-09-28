import { generateEmbedCode } from './generateEmbedCode';

describe('generateEmbedCode', () => {
  it('should generate embed code with correct src', () => {
    const props = {
      origin: 'https://example.com',
      language: 'en',
      name: 'example',
    };

    const scriptSrc = 'https://example.com/api/embed';
    const iframeSrc = 'https://example.com/en/example?isEmbedded=true';

    const result = generateEmbedCode(props);

    expect(result).toContain(`<script src="${scriptSrc}"`);
    expect(result).toContain(iframeSrc);
  });
});
