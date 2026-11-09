import { NextRouter } from 'next/router';

import { FormErrorsState } from 'types/register';
import { convertFormDataToObject } from 'utils/formHelpers';

export interface SubmitHandlerConfig {
  apiUrl: string;
  nextStep?: string;
  fallbackErrorKey?: string;
  setIsPending: (pending: boolean) => void;
  setFormSummaryErrors: (errors: FormErrorsState | null) => void;
  router: NextRouter;
}

export const createSubmitHandler = ({
  apiUrl,
  nextStep,
  fallbackErrorKey = 'general',
  setIsPending,
  setFormSummaryErrors,
  router,
}: SubmitHandlerConfig) => {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const nativeEvent = e.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement;

    const formData = new FormData(e.currentTarget);
    const data = convertFormDataToObject(formData) as Record<string, string>;

    if (submitter?.name) {
      data[submitter.name] = submitter.value;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json());

      if (response.error) {
        console.error(`API route call failed for ${apiUrl}:`, response);
        setFormSummaryErrors(response.fields ?? null);
      }

      if (response.success) {
        setFormSummaryErrors(null);
        router.push(response.nextPath ?? nextStep);
      }
    } catch (err) {
      console.error(`Error submitting form to ${apiUrl}:`, err);
      setFormSummaryErrors({ [fallbackErrorKey]: { error: 'general_error' } });
    } finally {
      setIsPending(false);
    }
  };
};
