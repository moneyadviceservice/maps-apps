export default {
  displayName: 'shared-mps',
  preset: '../../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/maps-apps/libs/shared-mps',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx,ts,tsx}',
    '!**/**/*.stories.{js,jsx,ts,tsx}',
    '!**/**/footerMocks.ts',
  ],
  moduleNameMapper: {
    '^@maps-react/common/(.*)$': '<rootDir>/../../../libs/shared/ui/src/$1',
    '^@maps-react/core/(.*)$': '<rootDir>/../../../libs/shared/core/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../../libs/shared/hooks/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/mocks/svg.ts',
  },
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
};
