import { useEffect, useLayoutEffect } from 'react';

import {
  FormFlowType,
  FormStep,
  isApplyToUsePart2Url,
  SIGN_UP_PART_2_HASH,
} from 'data/form-data/org_signup';
import { scrollToHashWhenReady } from 'utils/scroll';

/**
 * Scrolls to Part 2 of the signup form when SignUpUser mounts or the hash targets it.
 */
export const useSignUpPart2FormScroll = (
  formStep: FormStep,
  formFlowType?: FormFlowType,
) => {
  const isNewOrgPart2 =
    formFlowType === FormFlowType.NEW_ORG && formStep === FormStep.NEW_ORG_USER;

  useLayoutEffect(() => {
    if (!isNewOrgPart2) return;
    if (!isApplyToUsePart2Url()) return;

    scrollToHashWhenReady(SIGN_UP_PART_2_HASH);
  }, [isNewOrgPart2]);

  useEffect(() => {
    if (!isNewOrgPart2) return;

    const onHashChange = () => {
      if (globalThis.location.hash !== SIGN_UP_PART_2_HASH) return;
      scrollToHashWhenReady(SIGN_UP_PART_2_HASH);
    };

    globalThis.addEventListener('hashchange', onHashChange);
    return () => globalThis.removeEventListener('hashchange', onHashChange);
  }, [isNewOrgPart2]);
};
