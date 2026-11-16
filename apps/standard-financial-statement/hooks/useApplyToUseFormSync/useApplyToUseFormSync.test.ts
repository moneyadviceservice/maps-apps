import {
  FormFlowType,
  FormStep,
  SIGN_UP_PART_1_ID,
  SIGN_UP_PART_2_HASH,
} from 'data/form-data/org_signup';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useApplyToUseFormSync } from './useApplyToUseFormSync';

const setFormStep = jest.fn();
const scrollIntoViewMock = jest.fn();

describe('useApplyToUseFormSync', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      writable: true,
      value: scrollIntoViewMock,
    });

    window.history.replaceState({}, '', '/');
  });

  afterEach(() => {
    window.history.replaceState({}, '', '/');
    document.body.innerHTML = '';
  });

  it('promotes to part 2 when hash is present on mount', () => {
    window.history.replaceState({}, '', SIGN_UP_PART_2_HASH);

    renderHook(() =>
      useApplyToUseFormSync({
        activeErrors: { newForm: {}, existingForm: {} },
        formStep: FormStep.NEW_ORG,
        formFlowType: FormFlowType.NEW_ORG,
        setFormStep,
      }),
    );

    expect(setFormStep).toHaveBeenCalledWith(FormStep.NEW_ORG_USER);
  });

  it('promotes to part 2 when ?user=true is present on mount', () => {
    window.history.replaceState({}, '', '/?user=true');

    renderHook(() =>
      useApplyToUseFormSync({
        activeErrors: { newForm: {}, existingForm: {} },
        formStep: FormStep.NEW_ORG,
        formFlowType: FormFlowType.NEW_ORG,
        setFormStep,
      }),
    );

    expect(setFormStep).toHaveBeenCalledWith(FormStep.NEW_ORG_USER);
  });

  it('promotes to part 2 when the hash changes to sign-up-part-2', () => {
    renderHook(() =>
      useApplyToUseFormSync({
        activeErrors: { newForm: {}, existingForm: {} },
        formStep: FormStep.NEW_ORG,
        formFlowType: FormFlowType.NEW_ORG,
        setFormStep,
      }),
    );

    setFormStep.mockClear();

    window.history.pushState({}, '', SIGN_UP_PART_2_HASH);

    act(() => {
      globalThis.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(setFormStep).toHaveBeenCalledWith(FormStep.NEW_ORG_USER);
  });

  it('demotes to part 1 when part 2 URL markers are cleared', async () => {
    const part1Heading = document.createElement('h2');
    part1Heading.id = SIGN_UP_PART_1_ID;
    document.body.appendChild(part1Heading);

    renderHook(() =>
      useApplyToUseFormSync({
        activeErrors: { newForm: {}, existingForm: {} },
        formStep: FormStep.NEW_ORG_USER,
        formFlowType: FormFlowType.NEW_ORG,
        setFormStep,
      }),
    );

    setFormStep.mockClear();

    window.history.replaceState({}, '', '/');

    act(() => {
      globalThis.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(setFormStep).toHaveBeenCalledWith(FormStep.NEW_ORG);

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith(
        expect.objectContaining({
          behavior: 'auto',
          block: 'start',
        }),
      );
    });
  });

  it('scrolls to error summary when active errors are set', async () => {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-summary-container';
    errorContainer.focus = jest.fn();

    document.body.appendChild(errorContainer);

    const { rerender } = renderHook(
      ({ activeErrors }) =>
        useApplyToUseFormSync({
          activeErrors,
          formStep: FormStep.NEW_ORG,
          formFlowType: FormFlowType.NEW_ORG,
          setFormStep,
        }),
      {
        initialProps: {
          activeErrors: { newForm: {}, existingForm: {} },
        },
      },
    );

    rerender({
      activeErrors: {
        newForm: { organisationName: ['Required'] },
        existingForm: {},
      },
    });

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalled();
    });
  });
});
