/* eslint-disable */
export default {
  displayName: 'credit-options',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/maps-apps/apps/credit-options',
  coverageReporters: ['lcov', 'text'],
  rootDir: '.',
  moduleNameMapper: {
    '^@maps-react/form/(.*)$': '<rootDir>/../../libs/shared/form/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
  },
  testEnvironmentOptions: {
    url: 'https://moneyhelper.org.uk',
    referrer: 'https://moneyhelper.org.uk',
  },
  setupFilesAfterEnv: ['../../jest.setup.ts'],
};
