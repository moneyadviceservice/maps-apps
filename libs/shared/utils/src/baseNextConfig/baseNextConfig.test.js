const { baseNextConfig } = require('./index');

describe('baseNextConfig', () => {
  it('disables Next.js agent rules', () => {
    expect(baseNextConfig.agentRules).toBe(false);
  });
});
