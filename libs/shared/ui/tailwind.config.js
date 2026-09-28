const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../../tailwind-workspace-preset.js')],
  content: [
    join(
      path.resolve(__dirname, '../../../'),
      './libs/**/src/**/*.{ts,tsx,jsx}',
    ),
    join(path.resolve(__dirname, '../../../'), './apps/**/*.{ts,tsx,jsx}'),
    ...createGlobPatternsForDependencies(__dirname, '../../../'),
  ],
};
