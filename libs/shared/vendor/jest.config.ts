/* eslint-disable */
export default {
  displayName: 'shared-vendor',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/maps-apps/libs/shared-vendor',
  coverageReporters: ['lcov', 'text'],
  moduleNameMapper: {
    '^@maps-react/common/(.*)$': '<rootDir>/../../../libs/shared/ui/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../../libs/shared/hooks/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/mocks/svg.ts',
  },
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
};
