/* eslint-disable */
export default {
  displayName: 'adjustable-income-calculator',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../coverage/maps-apps/apps/adjustable-income-calculator',
  coverageReporters: ['lcov', 'text'],
  rootDir: '.',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@maps-react/form/(.*)$': '<rootDir>/../../libs/shared/form/src/$1',
    '^@maps-react/pension-tools/(.*)$':
      '<rootDir>/../../libs/shared/pension-tools/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
  },
};
