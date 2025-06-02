/* eslint-disable */
export default {
  displayName: 'shared-tools',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/maps-apps/libs/shared/tools',
  coverageReporters: ['lcov', 'text'],
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
};
