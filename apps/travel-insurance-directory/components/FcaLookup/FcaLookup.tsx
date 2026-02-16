import { useState } from 'react';

import { useRouter } from 'next/router';

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
      const res = await fetch(`/api/fca-lookup?fcaNumber=${fcaNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

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

  return (
    <form
      data-testid="registerForm"
      className="mt-6 max-w-lg"
      id="registerForm"
      action={`/api/fca-lookup`}
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
          label={'FCA Firm Reference Number (FRN)'}
          type="text"
          id="fcaNumber"
          name="fcaNumber"
          pattern="[0-9]+"
          title="Please enter a valid FCA reference number (numbers only)"
          defaultValue={initialFcaNumber ?? ''}
          disabled={isPending}
        />
      </div>

      <Paragraph className="mb-8 text-sm md:w-[130%]">
        You can enter details for one firm. This can be the main authorised firm
        OR one trading name registered to the FCA Firm Reference Number (FRN)
        above.
      </Paragraph>

      <Button type="submit" disabled={isPending}>
        Continue
      </Button>
    </form>
  );
};
