/* eslint-disable */
export default {
  displayName: 'shared-tools',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/shared/tools',
  setupFilesAfterEnv: ['../../../jest.setup.ts'],
};
