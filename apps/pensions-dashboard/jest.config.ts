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
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/lib/mocks/svg.ts',
    '^@maps-digital/ui/components/(.*)$':
      '<rootDir>/../../libs/shared/ui/src/lib/components/$1',
    '^@maps-digital/ui/layouts/(.*)$':
      '<rootDir>/../../libs/shared/ui/src/lib/layouts/$1',
    '^@maps-digital/ui/utils/(.*)$':
      '<rootDir>/../../libs/shared/ui/src/lib/utils/$1',
  },
};
