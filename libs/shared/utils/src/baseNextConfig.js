/**
 * Shared Next.js config. Every app next.config.js spreads this in.
 *
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const baseNextConfig = {
  // agentRules is off so next dev does not write AGENTS.md or CLAUDE.md.
  agentRules: false,
};

module.exports = { baseNextConfig };
