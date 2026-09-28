import { focusHashTarget } from './focusHashTarget';

const mockFocus = jest.fn();
const mockReplaceState = jest.fn();

const mockElement = {
  focus: mockFocus,
};

const mockGetElementById = jest.fn();

jest.spyOn(window.history, 'replaceState').mockImplementation(mockReplaceState);

jest.spyOn(document, 'getElementById').mockImplementation(mockGetElementById);

describe('focusHashTarget', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockGetElementById.mockReturnValue(null);

    window.history.pushState({}, '', '/test-path');
  });

  describe('when hash is allowed', () => {
    it.each([
      { hash: '#help-and-support', elementId: 'help-and-support' },
      { hash: '#onward-journey-heading', elementId: 'onward-journey-heading' },
      { hash: '#top', elementId: 'top' },
      { hash: '#no-income', elementId: 'no-income' },
    ])(
      'should focus element when hash is $hash and element exists',
      ({ hash, elementId }) => {
        window.history.pushState({}, '', `/test-path${hash}`);

        mockGetElementById.mockReturnValue(mockElement);

        focusHashTarget();

        expect(mockGetElementById).toHaveBeenCalledWith(elementId);
        expect(mockFocus).toHaveBeenCalled();
        expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/test-path');
      },
    );

    it('should not focus or replace state when element does not exist', () => {
      window.history.pushState({}, '', '/test-path#help-and-support');

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
      window.history.pushState({}, '', `/test-path${hash}`);

      focusHashTarget();

      expect(mockGetElementById).not.toHaveBeenCalled();
      expect(mockFocus).not.toHaveBeenCalled();
      expect(mockReplaceState).not.toHaveBeenCalled();
    });
  });
});
