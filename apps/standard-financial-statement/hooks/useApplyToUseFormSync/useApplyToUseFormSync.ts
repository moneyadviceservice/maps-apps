import { useEffect } from 'react';

import { FormTyeError } from 'components/FormErrorSummary/FormErrorSummary';
import {
  FormFlowType,
  FormStep,
  isApplyToUsePart2Url,
  SIGN_UP_PART_1_HASH,
} from 'data/form-data/org_signup';
import {
  afterLayout,
  scrollToErrorSummary,
  scrollToHashWhenReady,
} from 'utils/scroll';

const hasFormErrors = (errors: FormTyeError): boolean =>
  Object.keys(errors.newForm).length > 0 ||
  Object.keys(errors.existingForm).length > 0;

/** Part 2 promotion only applies to the new-org flow, before success. */
const shouldPromoteToPart2 = (
  formStep: FormStep | undefined,
  formFlowType: FormFlowType | undefined,
): boolean =>
  formStep !== FormStep.NEW_ORG_USER &&
  formStep !== FormStep.SUCCESS &&
  formFlowType === FormFlowType.NEW_ORG;

const shouldDemoteFromPart2 = (
  formStep: FormStep | undefined,
  formFlowType: FormFlowType | undefined,
): boolean =>
  formStep === FormStep.NEW_ORG_USER && formFlowType === FormFlowType.NEW_ORG;

type UseApplyToUseFormSyncParams = {
  activeErrors: FormTyeError;
  formStep: FormStep | undefined;
  formFlowType: FormFlowType | undefined;
  setFormStep: (step: FormStep) => void;
};

/**
 * Syncs apply-to-use form step with the URL and scrolls to validation errors.
 * Part 2 form scroll is handled by useSignUpPart2FormScroll in SignUpUser.
 */
export const useApplyToUseFormSync = ({
  activeErrors,
  formStep,
  formFlowType,
  setFormStep,
}: UseApplyToUseFormSyncParams) => {
  // Scroll after errors are committed — inline scroll in handlers races React paint.
  useEffect(() => {
    if (!hasFormErrors(activeErrors)) return;

    afterLayout(scrollToErrorSummary);
  }, [activeErrors]);

  // Sync formStep with URL on load, hash changes, and browser back/forward.
  useEffect(() => {
    const syncFormStepWithUrl = () => {
      if (
        isApplyToUsePart2Url() &&
        shouldPromoteToPart2(formStep, formFlowType)
      ) {
        setFormStep(FormStep.NEW_ORG_USER);
        return;
      }

      if (
        !isApplyToUsePart2Url() &&
        shouldDemoteFromPart2(formStep, formFlowType)
      ) {
        setFormStep(FormStep.NEW_ORG);
        scrollToHashWhenReady(SIGN_UP_PART_1_HASH);
      }
    };

    // Mount: promote only — server `step` prop may legitimately show Part 2 without URL markers.
    if (
      isApplyToUsePart2Url() &&
      shouldPromoteToPart2(formStep, formFlowType)
    ) {
      setFormStep(FormStep.NEW_ORG_USER);
    }

    globalThis.addEventListener('hashchange', syncFormStepWithUrl);
    globalThis.addEventListener('popstate', syncFormStepWithUrl);

    return () => {
      globalThis.removeEventListener('hashchange', syncFormStepWithUrl);
      globalThis.removeEventListener('popstate', syncFormStepWithUrl);
    };
  }, [formStep, formFlowType, setFormStep]);
};
