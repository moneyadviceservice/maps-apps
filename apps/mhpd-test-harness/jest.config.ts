const config = {
  displayName: 'mhpd-test-harness',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/next/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  coverageDirectory: '../../coverage/maps-apps/apps/mhpd-test-harness',
  rootDir: '.',
  coverageReporters: ['lcov', 'text'],
  moduleNameMapper: {
    '^@maps-public/locales/(.*)$': '<rootDir>/public/locales/$1',
    '^@maps-react/form/(.*)$': '<rootDir>/../../libs/shared/form/src/$1',
    '^.+\\.(svg)$': '<rootDir>/../../libs/shared/ui/src/mocks/svg.ts',
    '^public/.+\\.png$': '<rootDir>/../../libs/shared/ui/src/mocks/image.ts',
  },
  setupFilesAfterEnv: ['../../jest.setup.ts'],
};

export default config;
