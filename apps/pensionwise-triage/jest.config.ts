/* eslint-disable */
export default {
  displayName: 'pensionwise-triage',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/maps-apps/apps/pensionwise-triage',
  coverageReporters: ['lcov', 'text'],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
    '^@maps-react/common/(.*)$': '<rootDir>/../../libs/shared/ui/src/$1',
    '^@maps-react/vendor/components/(.*)$':
      '<rootDir>/../../libs/shared/vendor/src/components/$1',
  },
  setupFilesAfterEnv: ['../../jest.setup.ts'],
};
