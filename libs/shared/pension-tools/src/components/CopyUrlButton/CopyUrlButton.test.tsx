import { act, fireEvent, render, screen } from '@testing-library/react';

import { CopyUrlButton } from './CopyUrlButton';

import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {
      language: 'en',
    },
  }),
}));

jest.mock('copy-to-clipboard', () => jest.fn());

jest.mock('@maps-react/hooks/useTranslation', () => ({
  useTranslation: jest.fn().mockReturnValue({
    z: (key: { en: string; cy: string }) => key.en,
  }),
}));

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('CopyUrlButton', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it.each`
    label                          | labelConfirmation | expectedLabelConfirmation | labelResetDelay | expectedLabelResetDelay | url                             | expectedUrl                     | description
    ${'Copy URL'}                  | ${undefined}      | ${'Link copied'}          | ${undefined}    | ${3000}                 | ${undefined}                    | ${'http://localhost/'}          | ${'renders correctly with default/fallback prop values'}
    ${'Copy link to your results'} | ${'URL copied'}   | ${'URL copied'}           | ${5500}         | ${5500}                 | ${'https://moneyhelper.org.uk'} | ${'https://moneyhelper.org.uk'} | ${'renders correctly with custom prop values'}
  `(
    '$description',
    ({
      label,
      labelConfirmation,
      expectedLabelConfirmation,
      labelResetDelay,
      expectedLabelResetDelay,
      url,
      expectedUrl,
    }) => {
      const { container } = render(
        <CopyUrlButton
          label={label}
          labelConfirmation={labelConfirmation}
          labelResetDelay={labelResetDelay}
          url={url}
        />,
      );

      expect(container).toMatchSnapshot();

      // Verify default button label is rendered initially
      const button = screen.getByTestId('copy-url-button');
      expect(button).toHaveTextContent(label);
      expect(button).toHaveAttribute('type', 'button');

      // Verify active button label is rendered on click
      fireEvent.click(button);
      expect(button).toHaveTextContent(expectedLabelConfirmation);

      // Verify the URL was copied to clipboard
      const copy = require('copy-to-clipboard');
      expect(copy).toHaveBeenCalledWith(expectedUrl);

      // Verify setTimeout was called with the correct delay
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        expectedLabelResetDelay,
      );

      // Verify the button text has not reset before the delay
      act(() => {
        jest.advanceTimersByTime(expectedLabelResetDelay - 1);
      });
      expect(button).toHaveTextContent(expectedLabelConfirmation);

      // Verify the button text has reset after the delay
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(button).toHaveTextContent(label);
    },
  );
});
