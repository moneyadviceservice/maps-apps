/* eslint-disable import/no-anonymous-default-export */
export default {
  displayName: 'salary-calculator',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/maps-apps/apps/salary-calculator',
  rootDir: '.',
  coverageReporters: ['lcov', 'text'],
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
