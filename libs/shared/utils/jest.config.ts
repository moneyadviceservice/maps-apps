/* eslint-disable */
export default {
  displayName: 'shared-utils',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/shared-utils',
  moduleNameMapper: {
    '@maps-digital/shared/ui': '<rootDir>/../../../libs/shared/ui/src',
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/lib/mocks/svg.ts',
  },
};
