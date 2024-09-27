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
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../../libs/shared/hooks/src/$1',
    '^@maps-react/form/(.*)$': '<rootDir>/../../../libs/shared/form/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/mocks/svg.ts',
  },
};
