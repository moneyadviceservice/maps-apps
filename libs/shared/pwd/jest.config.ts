/* eslint-disable */
export default {
  displayName: 'shared-pwd',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/shared-pwd',
  moduleNameMapper: {
    '^@maps-react/common/(.*)$': '<rootDir>/../../../libs/shared/ui/src/$1',
    '^@maps-react/core/(.*)$': '<rootDir>/../../../libs/shared/core/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../../libs/shared/hooks/src/$1',
    '^@maps-react/form/(.*)$': '<rootDir>/../../../libs/shared/form/src/$1',
    '^@maps-react/vendor/(.*)$': '<rootDir>/../../../libs/shared/vendor/src/$1',
    '^@maps-react/layouts/(.*)$':
      '<rootDir>/../../../libs/shared/layouts/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../../libs/shared/ui/src/mocks/svg.ts',
  },
  collectCoverageFrom: [
    '**/components/**/*.{js,jsx,ts,tsx}',
    '**/layouts/**/*.{js,jsx,ts,tsx}',
    '!**/**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
};
