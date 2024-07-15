// tailwind-workspace-preset.js

const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('./tailwind-colors');
const fontSize = require('./tailwind-typography');

module.exports = {
  theme: {
    fontSize,
    extend: {
      borderWidth: {
        1: '1px',
        3: '3px',
      },
      colors,
      fontFamily: {
        sans: ['Roobert', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'bottom-gray': '0px 3px 0px rgba(0, 11, 59, 0.25)',
        'focus-outline': '0px 0px 0px 4px rgba(240, 240, 90, 1)',
        'select-focus': '0 0 0 2px #8200d1, 0 0 0 6px #f0f05a',
        'link-focus': '0 4px 0 0 #8200d1',
        'box-link-focus':
          'inset 0 5px 2px rgb(0 11 59 / 25%), 0 4px 0 0 rgb(0 11 59 / 25%)',
        'box-link': '0 2px 0 0 rgb(0 11 59 / 25%)',
        '1md': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      minWidth: {
        0: '0',
        '1/4': '25%',
        '1/3': '33%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
      },
      minHeight: {
        0: '0',
        '1/4': '25%',
        '1/3': '33%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
      },
      margin: {
        '-half-screen': '-50vw',
      },
    },
    backgroundImage: {
      hero_pension_wise: `url('../public/images/hero-pension-wise.png')`,
      tick_green: `url('../public/images/tick-green.png')`,
      cross_red: `url('../public/images/cross-red.png')`,
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
