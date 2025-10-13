/* eslint-disable */
export default {
  displayName: 'moneyhelper-contact-forms',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/maps-apps/apps/moneyhelper-contact-forms',
  coverageReporters: ['lcov', 'text'],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
    '^@maps-react/common/(.*)$': '<rootDir>/../../libs/shared/ui/src/$1',
    '^@maps-react/hooks/(.*)$': '<rootDir>/../../libs/shared/hooks/src/$1',
    '^/public/locales/(.*)$': '<rootDir>/public/locales/$1',
  },
  collectCoverageFrom: [
    '**/components/**/*.{js,jsx,ts,tsx}',
    '**/layouts/**/*.{js,jsx,ts,tsx}',
    '**/lib/**/*.{js,jsx,ts,tsx}',
    '**/store/**/*.{js,jsx,ts,tsx}',
    '**/form/**/*.{js,jsx,ts,tsx}',
    '**/guards/**/*.{js,jsx,ts,tsx}',
    '!**/**/*.stories.{js,jsx,ts,tsx}',
  ],
  setupFilesAfterEnv: ['../../jest.setup.ts'],
};
