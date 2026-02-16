/* eslint-disable */

export default {
  displayName: 'standard-financial-statement',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../coverage/maps-apps/apps/standard-financial-statement',
  coverageReporters: ['lcov', 'text'],
  rootDir: '.',
  moduleDirectories: ['node_modules', '<rootDir>'],
  collectCoverageFrom: [
    '**/components/**/*.{js,jsx,ts,tsx}',
    '**/layouts/**/*.{js,jsx,ts,tsx}',
    '**/lib/**/*.{js,jsx,ts,tsx}',
    '**/utils/**/*.{js,jsx,ts,tsx}',
    '**/pages/api/**/*.{js,jsx,ts,tsx}',
    '!**/**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFilesAfterEnv: ['../../jest.setup.ts'],
};
