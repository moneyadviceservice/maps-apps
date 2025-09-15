import { defaultCspHeader } from '../../../data/cspHeader';
import { setCSPScriptException } from './cspHelper';

const removeSpaces = (s: string) => {
  return s.replace(/\s+/g, ' ');
};

describe('Test csp helper functions', () => {
  it('should update csp header with new url exceptions', () => {
    const csp = setCSPScriptException({
      urlExceptions: {
        'img-src': 'img.example.com',
        'script-src': 'script.example.com',
        'base-uri': 'base.example.com',
        'connect-src': 'connect.example.com',
      },
    });
    console.log(`${defaultCspHeader['img-src']} ${'img.example.com'}`);
    expect(csp).toContain(
      `${removeSpaces(defaultCspHeader['img-src'])} ${'img.example.com'}`,
    );
    expect(csp).toContain(
      `${removeSpaces(defaultCspHeader['script-src'])}${'script.example.com'}`,
    );

    expect(csp).toContain(
      `${removeSpaces(defaultCspHeader['base-uri'])} ${'base.example.com'}`,
    );

    expect(csp).toContain(
      `${removeSpaces(
        defaultCspHeader['connect-src'],
      )} ${'connect.example.com'}`,
    );
  });

  it('should add nonce', () => {
    const csp = setCSPScriptException({
      urlExceptions: { 'script-src': `'nonce-123345878'` },
    });

    expect(csp).toContain(
      `${removeSpaces(defaultCspHeader['script-src'])}${"'nonce-123345878'"}`,
    );
  });
});
