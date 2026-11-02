const { baseNextConfig } = require('./baseNextConfig');

describe('baseNextConfig', () => {
  it('disables Next.js agent rules', () => {
    expect(baseNextConfig.agentRules).toBe(false);
  });
});
