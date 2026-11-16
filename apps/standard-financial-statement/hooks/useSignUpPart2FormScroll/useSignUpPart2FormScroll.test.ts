import {
  FormFlowType,
  FormStep,
  SIGN_UP_PART_2_HASH,
  SIGN_UP_PART_2_ID,
} from 'data/form-data/org_signup';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useSignUpPart2FormScroll } from './useSignUpPart2FormScroll';

const scrollIntoViewMock = jest.fn();

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  value: scrollIntoViewMock,
});

describe('useSignUpPart2FormScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('scrolls to Part 2 when it mounts with the hash in the URL', async () => {
    window.history.replaceState({}, '', SIGN_UP_PART_2_HASH);

    const heading = document.createElement('h2');
    heading.id = SIGN_UP_PART_2_ID;
    document.body.appendChild(heading);

    renderHook(() =>
      useSignUpPart2FormScroll(FormStep.NEW_ORG_USER, FormFlowType.NEW_ORG),
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'auto',
          block: 'start',
        }),
      );
    });
  });

  it('scrolls to Part 2 when ?user=true is in the URL', async () => {
    window.history.replaceState({}, '', '/?user=true');

    const heading = document.createElement('h2');
    heading.id = SIGN_UP_PART_2_ID;
    document.body.appendChild(heading);

    renderHook(() =>
      useSignUpPart2FormScroll(FormStep.NEW_ORG_USER, FormFlowType.NEW_ORG),
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });

  it('does not scroll for the existing-org flow', async () => {
    window.history.replaceState({}, '', SIGN_UP_PART_2_HASH);

    const heading = document.createElement('h2');
    heading.id = SIGN_UP_PART_2_ID;
    document.body.appendChild(heading);

    renderHook(() =>
      useSignUpPart2FormScroll(
        FormStep.EXISTING_ORG,
        FormFlowType.EXISTING_ORG,
      ),
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });
  });

  it('scrolls when the hash changes to sign-up-part-2', async () => {
    const heading = document.createElement('h2');
    heading.id = SIGN_UP_PART_2_ID;
    document.body.appendChild(heading);

    renderHook(() =>
      useSignUpPart2FormScroll(FormStep.NEW_ORG_USER, FormFlowType.NEW_ORG),
    );

    scrollIntoViewMock.mockClear();

    window.history.pushState({}, '', SIGN_UP_PART_2_HASH);

    act(() => {
      globalThis.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });
});
