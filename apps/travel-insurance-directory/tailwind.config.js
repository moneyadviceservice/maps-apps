const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  safelist: [
    // Length-of-trip visibility: show .single / .multi when trip_type radio is checked (CSS-only)
    '[#filter-menu:has(#filters-trip_type-single-trip:checked)_&]:hidden',
    '[#filter-menu:has(#filters-trip_type-annual-multi-trip:checked)_&]:hidden',
    '[#filter-menu:has(#filters-trip_type-single-trip:checked)_&]:block',
    '[#filter-menu:has(#filters-trip_type-single-trip:checked)_&]:pointer-events-auto',
    '[#filter-menu:has(#filters-trip_type-annual-multi-trip:checked)_&]:block',
    '[#filter-menu:has(#filters-trip_type-annual-multi-trip:checked)_&]:pointer-events-auto',
  ],
  content: [
    join(
      __dirname,
      '{src,pages,components,app,layouts}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
