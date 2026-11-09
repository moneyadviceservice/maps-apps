import { getStatePensionMessage } from './getStatePensionMessage';

const messages = {
  statePensionMessageEng: 'State Pension Message English',
  statePensionMessageWelsh: 'State Pension Message Welsh',
};

describe('getStatePensionMessage', () => {
  it.each`
    locale       | expected
    ${'en'}      | ${'State Pension Message English'}
    ${undefined} | ${'State Pension Message English'}
    ${'cy'}      | ${'State Pension Message Welsh'}
  `('returns the $locale message', ({ locale, expected }) => {
    expect(getStatePensionMessage(messages, locale)).toBe(expected);
  });

  it('returns undefined when the selected message is missing', () => {
    expect(getStatePensionMessage({}, 'en')).toBeUndefined();
    expect(getStatePensionMessage({}, 'cy')).toBeUndefined();
  });

  it('converts plain text URLs to markdown links', () => {
    expect(
      getStatePensionMessage(
        {
          statePensionMessageEng:
            'Check your pension at https://www.example.com/1 and visit https://www.example.com/2 for more info',
        },
        'en',
      ),
    ).toBe(
      'Check your pension at [https://www.example.com/1](https://www.example.com/1) and visit [https://www.example.com/2](https://www.example.com/2) for more info',
    );

    expect(
      getStatePensionMessage(
        {
          statePensionMessageWelsh:
            'Gwiriwch eich pensiwn yn https://www.example.com/1',
        },
        'cy',
      ),
    ).toBe(
      'Gwiriwch eich pensiwn yn [https://www.example.com/1](https://www.example.com/1)',
    );
  });
});
