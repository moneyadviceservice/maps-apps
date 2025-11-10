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
        inset: 'inset 0px 2px 2px rgba(0, 11, 59, 0.25)',
        'bottom-gray': '0px 3px 0px rgba(0, 11, 59, 0.25)',
        'bottom-white': '0px 1px 0px rgba(255, 255, 255, 1)',
        'top-gray':
          '0px 3px 0px rgba(0, 11, 59, 0.25) inset, 0px 1px 0px 0px #fff',
        'bottom-slate': '0px 4px 7px 0px rgba(155, 158, 192, 0.38)',
        'focus-outline':
          '0 0 0 3px #0F19A0, 0px 0px 0px 6px rgba(240, 240, 90, 1)',
        'select-focus': '0 0 0 2px #8200d1, 0 0 0 6px #f0f05a',
        'expander-focus': '0 0 0 4px #0F19A0, 0 0 0 7px #F0F05A',
        'link-focus': '0 4px 0 0 #0F19A0',
        'box-link-focus':
          'inset 0 5px 2px rgb(0 11 59 / 25%), 0 4px 0 0 rgb(0 11 59 / 25%)',
        'box-link': '0 2px 0 0 rgb(0 11 59 / 25%)',
        '1md': '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        tooltip: '0px 8px 16px 0px rgba(0, 0, 0, 0.12)',
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
      backgroundImage: {
        hero_pension_wise: `url('../public/images/hero-pension-wise.png')`,
        tick_green: `url('../public/images/tick-green.png')`,
        tick_grey: `url('../public/images/tick-grey.svg')`,
        cross_red: `url('../public/images/cross-red.png')`,
        grey_stripe: `url('../public/images/grey-stripe.png')`,
      },
    },
  },
  plugins: [require('tailwindcss'), require('autoprefixer')],
};
