import { linkToTestId } from './linkToTestId';

describe('linkToTestId', () => {
  it.each([
    ['/what-is-the-sfs', 'what-is-the-sfs-link'],
    [
      '/use-the-sfs/spending-guidelines',
      'use-the-sfs-spending-guidelines-link',
    ],
    ['/privacy', 'privacy-link'],
    ['/', 'home-link'],
  ])('maps %s to %s', (linkTo, expected) => {
    expect(linkToTestId(linkTo)).toBe(expected);
  });
});
