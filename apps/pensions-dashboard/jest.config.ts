/* eslint-disable */
export default {
  displayName: 'pensions-dashboard',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/pensions-dashboard',
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
    '^@maps-react/common/(.*)$': '<rootDir>/../../libs/shared/ui/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../libs/shared/hooks/src/$1',
  },
};
