export default {
  displayName: 'shared-csp-policy',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/shared/csp-policy',
  coverageReporters: ['lcov', 'text'],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/mocks/svg.ts',
  },
  collectCoverageFrom: [
    '**/components/**/*.{js,jsx,ts,tsx}',
    '**/hooks/**/*.{js,jsx,ts,tsx}',
    '**/lib/**/**/*.{js,jsx,ts,tsx}',
    '!**/**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
};
