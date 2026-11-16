import { createSubmissionKey } from './createSubmissionKey';

describe('createSubmissionKey', () => {
  it('returns the same key for the same request body', () => {
    const requestBody = JSON.stringify({ reference: 'abc123' });

    expect(createSubmissionKey(requestBody)).toBe(
      createSubmissionKey(requestBody),
    );
  });

  it('returns different keys for different request bodies', () => {
    expect(createSubmissionKey('{"reference":"abc123"}')).not.toBe(
      createSubmissionKey('{"reference":"xyz789"}'),
    );
  });
});
