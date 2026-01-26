import { v4 as uuidv4 } from 'uuid';
import { getSessionId } from './get-session-id';

jest.mock('uuid', () => ({ v4: jest.fn() }));

const mockV4 = uuidv4 as jest.Mock;

describe('getSessionId', () => {
  afterEach(() => {
    mockV4.mockReset();
  });

  it('returns the provided sessionId when non-empty string is given', () => {
    const provided = 'existing-session-id';
    const result = getSessionId(provided);
    expect(result).toBe(provided);
    expect(mockV4).not.toHaveBeenCalled();
  });

  it('generates a new id when sessionId is undefined', () => {
    mockV4.mockReturnValue('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
    const result = getSessionId(undefined);
    expect(mockV4).toHaveBeenCalledTimes(1);
    expect(result).toBe('a'.repeat(32));
  });

  it('generates a new id when sessionId is an empty string', () => {
    mockV4.mockReturnValue('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');
    const result = getSessionId('');
    expect(mockV4).toHaveBeenCalledTimes(1);
    expect(result).toBe('b'.repeat(32));
  });

  it('returns numeric-like strings unchanged', () => {
    expect(getSessionId('0')).toBe('0');
    expect(getSessionId('12345')).toBe('12345');
    expect(mockV4).not.toHaveBeenCalled();
  });
});
