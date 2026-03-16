import { useState } from 'react';

import { useRouter } from 'next/router';

import { page } from 'data/pages/register';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { Paragraph } from '@maps-react/common/index';
import { TextInput } from '@maps-react/form/components/TextInput';

interface FcaLookupProps {
  hasError?: boolean;
  initialFcaNumber?: string | null;
}

export const FcaLookup = ({
  initialFcaNumber = '',
}: Readonly<FcaLookupProps>) => {
  const router = useRouter();

  const [error, setError] = useState<string | null>();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const fcaNumber = formData.get('fcaNumber') as string;

    try {
      const res = await fetch(
        `/api/register/fca-lookup?fcaNumber=${fcaNumber}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else if (data.Data) {
        setError('No records found');
      } else {
        router.push(`/register/step-2`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    }

    setIsPending(false);
  };

  const input = page.fcaPage.inputs.frn[0];

  return (
    <form
      data-testid="registerForm"
      className="mt-6 max-w-lg"
      id="registerForm"
      action={`/api/register/fca-lookup`}
      method="GET"
      onSubmit={handleSubmit}
      noValidate
    >
      <div
        className={twMerge(
          'mb-8',
          error && 'border-0 border-l-4 pl-5 border-red-700 border-solid',
        )}
      >
        <TextInput
          error={error ?? undefined}
          label={input.label}
          type={input.type}
          id={input.key}
          name={input.key}
          pattern={input.regex}
          title={input.title}
          defaultValue={initialFcaNumber ?? ''}
          disabled={isPending}
        />
      </div>

      <Paragraph className="mb-8 text-sm md:w-[130%]">
        {page.fcaPage.info.body}
      </Paragraph>

      <Button type="submit" disabled={isPending}>
        {page.fcaPage.submitButton.label}
      </Button>
    </form>
  );
};
