export type ValidateReferrer = {
  success: boolean;
  message: string;
  correlationId: string;
};

function isApiResponse(data: ValidateReferrer): data is ValidateReferrer {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.success === 'boolean' &&
    typeof data.message === 'string' &&
    data.message.length > 0 &&
    typeof data.correlationId === 'string'
  );
}

async function apiHandler(
  referrerId: string,
): Promise<ValidateReferrer | null> {
  const code = process.env.FETCH_VALIDATE_REFERRER_CODE;

  if (!code) {
    console.error('Missing required parameters: FETCH_APPOINTMENT_SLOTS_CODE');
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.APPOINTMENTS_API}ValidateReferrer?code=${code}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referrerID: referrerId }),
      },
    );

    if (!response.ok) {
      console.error(`Error from external API: ${response.statusText}`);
      return null;
    }

    const data: ValidateReferrer = await response.json();

    if (!isApiResponse(data)) {
      console.error('Unexpected API response:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      'Internal Server Error fetching referrerId validation:',
      error,
    );

    return null;
  }
}

export const validateReferrer = async (
  referrerId: string,
): Promise<{
  validatedReferrerId?: ValidateReferrer;
  error?: string;
}> => {
  const validatedReferrerId = await apiHandler(referrerId);

  if (!validatedReferrerId) {
    return { error: 'Failed to validate referrer Id' };
  }

  return { validatedReferrerId };
};
