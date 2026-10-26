import { SubmitEvent } from 'react';

import { NextRouter } from 'next/router';

import {
  FormStep,
  SIGN_UP_PART_1_ID,
  SIGN_UP_PART_2_ID,
} from 'data/form-data/org_signup';
import { Entry, EntryData, FormError } from 'lib/types';

interface SubmitOrgParams {
  e: SubmitEvent<HTMLFormElement>;
  lang: string;
  router: NextRouter;
  handleErrors: (errors: FormError[], data: EntryData) => void;
  resetErrors: () => void;
  switchFormStep: (form: FormStep) => void;
  onSuccess?: (entry: Entry) => void;
}

export async function submitOrg({
  e,
  lang,
  router,
  handleErrors,
  resetErrors,
  switchFormStep,
  onSuccess,
}: SubmitOrgParams) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const dataObject = Object.fromEntries(formData.entries());

  const geoRegions = formData.getAll('geoRegions');
  const memberships = formData.getAll('memberships');
  const debtAdvice = formData.getAll('debtAdvice');

  try {
    const res = await fetch('/fn/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dataObject,
        geoRegions: geoRegions.length ? geoRegions : [],
        memberships: memberships.length ? memberships : [],
        debtAdvice: debtAdvice.length ? debtAdvice : [],
      }),
    });

    const result = await res.json();

    if (result.entry?.errors?.length) {
      console.error(
        'Error returned from form-handler to toggle form provider for org submit',
        result.error,
      );

      handleErrors(result.entry?.errors, result.entry?.data);

      return;
    }

    resetErrors();

    if (result.entry) {
      onSuccess?.(result.entry);
    }

    // Stamp Part 1 hash on the current history entry so browser back lands on #sign-up-part-1.
    await router.replace(
      {
        pathname: `/${lang}/apply-to-use-the-sfs`,
        hash: SIGN_UP_PART_1_ID,
      },
      undefined,
      { scroll: false, shallow: true },
    );

    switchFormStep(FormStep.NEW_ORG_USER);

    await router.push(
      {
        pathname: `/${lang}/apply-to-use-the-sfs`,
        query: { user: true },
        hash: SIGN_UP_PART_2_ID,
      },
      undefined,
      { scroll: false },
    );
  } catch (err) {
    console.error('Error submitting org form:', err);
  }
}
