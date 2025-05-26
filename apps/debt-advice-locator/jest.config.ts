/* eslint-disable */

export default {
  displayName: 'debt-advice-locator',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/maps-apps/apps/debt-advice-locator',
  coverageReporters: ['lcov', 'text'],
  rootDir: '.',
  moduleDirectories: ['node_modules', '<rootDir>'],
};
