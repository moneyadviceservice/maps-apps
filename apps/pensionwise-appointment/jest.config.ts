/* eslint-disable */
export default {
  displayName: 'pensionwise-appointment',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/pensionwise-appointment',
  moduleNameMapper: {
    '^@maps-react/common/(.*)$': '<rootDir>/../../libs/shared/ui/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../libs/shared/hooks/src/$1',
    '^@maps-react/pwd/(.*)$': '<rootDir>/../../libs/shared/pwd/src/$1',
    '^@maps-react/vendor/(.*)$': '<rootDir>/../../libs/shared/vendor/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
  },
};
