import { parseIsChangeAnswer } from './parseIsChangeAnswer';

describe('parseIsChangeAnswer', () => {
  it('parseIsChangeAnswer reads query param', () => {
    expect(
      parseIsChangeAnswer({
        query: { isChangeAnswer: 'true' },
        body: {},
      } as never),
    ).toBe(true);
  });

  it('parseIsChangeAnswer reads body field', () => {
    expect(
      parseIsChangeAnswer({
        query: {},
        body: { isChangeAnswer: 'true' },
      } as never),
    ).toBe(true);
  });
});
