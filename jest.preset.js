const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: [
    // Allow Jest to transform slug ESM
    'node_modules/(?!(slug)/)',
  ],
};
