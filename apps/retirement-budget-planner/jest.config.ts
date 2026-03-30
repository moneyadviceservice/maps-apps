/* eslint-disable */
export default {
  displayName: 'retirement-budget-planner',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  rootDir: '.',
  moduleDirectories: ['node_modules', '<rootDir>'],
  coverageDirectory: '../../coverage/maps-apps/apps/retirement-budget-planner',
  coverageReporters: ['lcov', 'text'],
  moduleNameMapper: {
    '^@maps-react/common/(.*)$': '<rootDir>/../../libs/shared/ui/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../libs/shared/hooks/src/$1',
    '^@maps-react/pwd/(.*)$': '<rootDir>/../../libs/shared/pwd/src/$1',
    '^@maps-react/vendor/(.*)$': '<rootDir>/../../libs/shared/vendor/src/$1',
    '^.+\\.(svg)\\?url$': '<rootDir>/../../libs/shared/ui/src/mocks/image.ts',
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
  },
  setupFilesAfterEnv: ['../../jest.setup.ts'],
};
