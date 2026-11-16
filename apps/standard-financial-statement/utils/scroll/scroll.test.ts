import {
  SIGN_UP_PART_2_HASH,
  SIGN_UP_PART_2_ID,
} from 'data/form-data/org_signup';

import {
  afterLayout,
  scrollElementIntoView,
  scrollToErrorSummary,
  scrollToHashRegion,
} from './scroll';

describe('scroll utils', () => {
  const scrollIntoViewMock = jest.fn();
  const focusMock = jest.fn();

  beforeEach(() => {
    scrollIntoViewMock.mockClear();
    focusMock.mockClear();
    Object.defineProperty(globalThis.Element.prototype, 'scrollIntoView', {
      writable: true,
      value: scrollIntoViewMock,
    });
  });

  describe('scrollToErrorSummary', () => {
    it('focuses and scrolls the error summary container', () => {
      const errorContainer = document.createElement('div');
      errorContainer.id = 'error-summary-container';
      errorContainer.focus = focusMock;
      document.body.appendChild(errorContainer);

      scrollToErrorSummary();

      expect(focusMock).toHaveBeenCalled();
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
      });
    });
  });

  describe('scrollElementIntoView', () => {
    it('focuses target without adding tabindex when already present', () => {
      const target = document.createElement('div');
      target.id = SIGN_UP_PART_2_ID;
      target.setAttribute('tabindex', '0');
      target.focus = focusMock;
      document.body.appendChild(target);

      scrollElementIntoView(target);

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
      });
      expect(focusMock).toHaveBeenCalled();
      expect(target.hasAttribute('tabindex')).toBe(true);
    });
  });

  describe('scrollToHashRegion', () => {
    it('scrolls to the element matching the hash', () => {
      const target = document.createElement('div');
      target.id = SIGN_UP_PART_2_ID;
      target.focus = focusMock;
      document.body.appendChild(target);

      expect(scrollToHashRegion(SIGN_UP_PART_2_HASH)).toBe(true);

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
      });
      expect(focusMock).toHaveBeenCalled();
    });

    it('returns false when the hash target is missing', () => {
      expect(scrollToHashRegion('#missing-target')).toBe(false);
    });
  });

  describe('afterLayout', () => {
    it('runs callback after two animation frames', () => {
      const callback = jest.fn();
      const rafSpy = jest
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((cb) => {
          cb(0);
          return 1;
        });

      afterLayout(callback);

      expect(callback).toHaveBeenCalledTimes(1);

      rafSpy.mockRestore();
    });
  });
});
