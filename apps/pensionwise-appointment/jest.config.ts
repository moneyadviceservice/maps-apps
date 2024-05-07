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
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/lib/mocks/svg.ts',
  },
};
