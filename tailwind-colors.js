// tailwind-colors.js

module.exports = {
  current: 'currentColor',
  red: {
    100: '#FFF0F0',
    400: '#D97D7D',
    600: '#CC0000', // Error and negative state
    700: '#d00000',
  },
  yellow: {
    100: '#FCF8ED',
    150: '#FFF4D7',
    180: '#FFF9EB',
    // 200: '#F0F05A', // Moved to yellow-400
    400: '#F0F05A', // Focus state and brand yellow
    700: '#FFC200',
  },
  amber: {
    500: '#FFC200', // (From brand color table 2025)
  },
  gray: {
    95: '#EFEFF6', // Consolidated light greys
    100: '#f3f1f3',
    150: '#F7F6F6',
    200: '#EDF0F0',
    300: '#9DA1CA', // Borders and horizontal rules (hr)
    350: '#DADADA',
    400: '#7B80B7', // Placeholder
    450: '#434559',
    500: '#33333F',
    600: '#52557A', // Input placeholder text
    650: '#60637E', // MHPD support/grey-600
    700: '#292B3D', // Border hover state
    800: '#000b3b',
  },
  green: {
    100: '#F0F7F2',
    200: '#EDF7E3',
    300: '#B0CA35',
    400: '#7DB68B',
    500: '#8DAB01',
    600: '#54AC00',
    700: '#008021',
    800: '#006637', // Positive and success state
    850: '#05754D', // MHPD illustrations only dark green
  },
  slate: {
    100: '#7F83BF',
    200: '#FBFAFB',
    300: '#EFEFF6',
    350: '#d8d9e4',
    400: '#9da1ca',
    500: '#7E82A5',
  },
  pink: {
    400: '#db7bb4',
    800: '#ae0060',
    900: '#9c0052',
  },
  teal: {
    100: '#E9F5F6',
    300: '#6FD8D8',
    400: '#6FD8D8', // Brand teal color
    700: '#007F99', // Brand dark teal color
  },
  blue: {
    100: '#F1F2FA',
    200: '#E7E8F6',
    300: '#DFE4E7',
    600: '#00283E',
    700: '#0F19A0', // brand-primary
    900: '#04072F', // for all text
  },
  purple: {
    100: '#F4F1FB',
    600: '#7E00CC', // Focus style dark mode only
    650: '#792B9E', // MHPD support/purple-600
    700: '#5F0099', // Link visited state
  },
  magenta: {
    300: '#E481BB', // (brand color)
    500: '#C82A87', // brand-secondary
    700: '#990059', // General active (pressed) states
    800: '#3B102C',
  },
};
