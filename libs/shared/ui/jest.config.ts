/* eslint-disable */
export default {
  displayName: 'shared-ui',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/shared-ui',
  moduleNameMapper: {
    '@maps-digital/shared/hooks': '<rootDir>/../../../libs/shared/hooks/src',
    '@maps-digital/shared/ui': '<rootDir>/../../../libs/shared/ui/src',
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/lib/mocks/svg.ts',
  },
};
