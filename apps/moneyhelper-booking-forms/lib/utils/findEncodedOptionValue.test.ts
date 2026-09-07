import { findEncodedOptionValue } from './findEncodedOptionValue';

describe('findEncodedOptionValue', () => {
  const options = [
    { value: 'yes|access-options' },
    { value: 'none-requested|pre-appointment' },
  ];

  it('returns matching encoded value from a stored plain answer', () => {
    expect(findEncodedOptionValue(options, 'yes')).toBe('yes|access-options');
  });

  it('returns undefined when selected value is missing', () => {
    expect(findEncodedOptionValue(options)).toBeUndefined();
  });

  it('returns undefined when there is no matching option', () => {
    expect(findEncodedOptionValue(options, 'no-match')).toBeUndefined();
  });
});
