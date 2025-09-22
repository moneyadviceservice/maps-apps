// this file is used to fix a bug in the test
// Error :  Your focus-trap must have at least one container with at least one tabbable node in it at all times
// https://stackoverflow.com/questions/72762696/jest-error-your-focus-trap-must-have-at-least-one-container-with-at-least-one

const lib = jest.requireActual('tabbable');

const tabbable = {
  ...lib,
  tabbable: (node, options) =>
    lib.tabbable(node, {
      ...options,
      displayCheck: 'none',
    }),
  focusable: (node, options) =>
    lib.focusable(node, {
      ...options,
      displayCheck: 'none',
    }),
  isFocusable: (node, options) =>
    lib.isFocusable(node, {
      ...options,
      displayCheck: 'none',
    }),
  isTabbable: (node, options) =>
    lib.isTabbable(node, {
      ...options,
      displayCheck: 'none',
    }),
};

module.exports = tabbable;
