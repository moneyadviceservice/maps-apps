import { shouldEnforceUniqueFcaNumber } from './shouldEnforceUniqueFcaNumber';

describe('shouldEnforceUniqueFcaNumber', () => {
  const originalEnv = process.env.ENVIRONMENT;

  afterEach(() => {
    process.env.ENVIRONMENT = originalEnv;
  });

  it.each(['development', 'staging', 'test', undefined])(
    'allows duplicate FRNs when ENVIRONMENT is %s',
    (environment) => {
      if (environment === undefined) {
        delete process.env.ENVIRONMENT;
      } else {
        process.env.ENVIRONMENT = environment;
      }

      expect(shouldEnforceUniqueFcaNumber()).toBe(false);
    },
  );

  it('rejects duplicate FRNs in production', () => {
    process.env.ENVIRONMENT = 'production';

    expect(shouldEnforceUniqueFcaNumber()).toBe(true);
  });
});
