import { defaultCspHeader } from '../../data';
import { setCSPScriptException } from './cspHelper';

const removeSpaces = (s: string) => {
  return s.replace(/\s+/g, ' ');
};

describe('Test csp helper functions', () => {
  beforeEach(() => {
    process.env.CSP_STRICT_DYNAMIC_ENABLED = 'false';
  });

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
      `${removeSpaces(`${defaultCspHeader['script-src']}`)}`,
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
      nonce: '123345878',
    });

    expect(csp).toContain(
      removeSpaces(`${defaultCspHeader['script-src']}`) +
        ` 'nonce-${123345878}'`,
    );
  });

  it('should handle empty url exceptions', () => {
    const csp = setCSPScriptException({
      urlExceptions: {},
    });

    // Should return default CSP header when no exceptions provided
    expect(csp).toBeTruthy();
    expect(csp).toContain('default-src');
  });

  it('should handle url exceptions that are not in default CSP', () => {
    const csp = setCSPScriptException({
      urlExceptions: {
        'form-action': "'self'",
        'frame-ancestors': "'none'",
        'custom-directive': 'custom-value',
      },
    });

    expect(csp).toContain('form-action');
    expect(csp).toContain('frame-ancestors');
    expect(csp).toContain('custom-directive');
  });

  it('should handle multiple values for the same directive', () => {
    const csp = setCSPScriptException({
      urlExceptions: {
        'script-src': "'nonce-123' 'unsafe-inline' example.com",
      },
    });

    expect(csp).toContain("'nonce-123'");
    expect(csp).toContain("'unsafe-inline'");
    expect(csp).toContain('example.com');
  });

  it('should override default values when exceptions are provided', () => {
    const csp = setCSPScriptException({
      urlExceptions: {
        'img-src': "'none'", // Override default img-src
      },
    });

    // Should contain the override value added to existing img-src
    expect(csp).toContain("'none'");
    expect(csp).toContain('img-src');
  });

  it('uses strict-dynamic header when CSP_STRICT_DYNAMIC_ENABLED is true', () => {
    process.env.CSP_STRICT_DYNAMIC_ENABLED = 'true';

    const csp = setCSPScriptException({
      nonce: '123345878',
    });

    expect(csp).toContain(
      "script-src 'self' 'strict-dynamic' 'unsafe-eval' 'nonce-123345878';",
    );

    expect(csp).not.toContain(
      `${removeSpaces(`${defaultCspHeader['script-src']}`)}`,
    );
  });
});
