import { focusHashTarget } from './focusHashTarget';

// Mock window and document
const mockFocus = jest.fn();
const mockReplaceState = jest.fn();

const mockElement = {
  focus: mockFocus,
};

const mockGetElementById = jest.fn();

Object.defineProperty(window, 'location', {
  value: {
    hash: '',
    pathname: '/test-path',
  },
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
  writable: true,
});

Object.defineProperty(document, 'getElementById', {
  value: mockGetElementById,
  writable: true,
});

describe('focusHashTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetElementById.mockReturnValue(null);
    window.location.hash = '';
  });

  describe('when hash is allowed', () => {
    it.each([
      { hash: '#help-and-support', elementId: 'help-and-support' },
      { hash: '#top', elementId: 'top' },
      { hash: '#no-income', elementId: 'no-income' },
    ])(
      'should focus element when hash is $hash and element exists',
      ({ hash, elementId }) => {
        window.location.hash = hash;
        mockGetElementById.mockReturnValue(mockElement);

        focusHashTarget();

        expect(mockGetElementById).toHaveBeenCalledWith(elementId);
        expect(mockFocus).toHaveBeenCalled();
        expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/test-path');
      },
    );

    it('should not focus or replace state when element does not exist', () => {
      window.location.hash = '#help-and-support';
      mockGetElementById.mockReturnValue(null);

      focusHashTarget();

      expect(mockGetElementById).toHaveBeenCalledWith('help-and-support');
      expect(mockFocus).not.toHaveBeenCalled();
      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });

  describe('when hash is not allowed', () => {
    it.each([
      { hash: '#not-allowed', description: 'hash is not in allowed list' },
      { hash: '', description: 'there is no hash' },
    ])('should not focus element when $description', ({ hash }) => {
      window.location.hash = hash;

      focusHashTarget();

      expect(mockGetElementById).not.toHaveBeenCalled();
      expect(mockFocus).not.toHaveBeenCalled();
      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });

  describe('server-side rendering', () => {
    it('should not throw error when window is undefined', () => {
      const originalWindow = global.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (global as any).window;

      expect(() => focusHashTarget()).not.toThrow();

      global.window = originalWindow;
    });
  });
});
