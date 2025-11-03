import { FormEvent } from 'react';

import { NextRouter } from 'next/router';

import { FormType } from 'data/form-data/org_signup';
import { FormError } from 'lib/types';

interface SubmitOrgParams {
  e: FormEvent<HTMLFormElement>;
  lang: string;
  router: NextRouter;
  handleErrors: (errors: FormError[]) => void;
  resetErrors: () => void;
  switchFormType: (form: FormType) => void;
}

export async function submitOrg({
  e,
  lang,
  router,
  handleErrors,
  resetErrors,
  switchFormType,
}: SubmitOrgParams) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const dataObject = Object.fromEntries(formData.entries());

  const geoRegions = formData.getAll('geoRegions');
  const memberships = formData.getAll('memberships');

  try {
    const res = await fetch('/fn/form-handler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...dataObject,
        geoRegions: geoRegions.length ? geoRegions : [],
        memberships: memberships.length ? memberships : [],
      }),
    });

    const result = await res.json();

    if (result.entry?.errors?.length) {
      console.error(
        'Error returned from form-handler to toggle form provider for org submit',
        result.error,
      );

      handleErrors(result.entry?.errors);

      return;
    }

    resetErrors();

    switchFormType(FormType.NEW_ORG_USER);

    router.push(
      {
        pathname: `/${lang}/apply-to-use-the-sfs`,
        query: { user: true },
        hash: 'sign-up-part-2',
      },
      undefined,
      { scroll: false },
    );
  } catch (err) {
    console.error('Error submitting org form:', err);
  }
}
