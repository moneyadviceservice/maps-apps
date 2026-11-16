export type BusinessClosureStatus = {
  success: boolean;
  date: string;
  closed: boolean;
};

function isApiResponse(
  data: BusinessClosureStatus,
): data is BusinessClosureStatus {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.success === 'boolean' &&
    data.success &&
    typeof data.date === 'string' &&
    typeof data.closed === 'boolean'
  );
}

async function apiHandler(): Promise<BusinessClosureStatus | null> {
  const code = process.env.FETCH_BUSINESS_CLOSED_CODE;

  const date = new Date();
  const slotDate = date.toLocaleDateString('en-GB');

  if (!code) {
    console.error('Missing required parameters: FETCH_APPOINTMENT_SLOTS_CODE');
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.APPOINTMENTS_API}GetBusinessClosureStatus?code=${code}&slotDate=${slotDate}`,
    );

    if (!response.ok) {
      console.error(`Error from external API: ${response.statusText}`);
      return null;
    }

    const data: BusinessClosureStatus = await response.json();

    if (!isApiResponse(data)) {
      console.error('Unexpected API response:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      'Internal Server Error fetching business closed status:',
      error,
    );

    return null;
  }
}

export const getBusinessClosureStatus = async (): Promise<{
  businessClosureStatus?: BusinessClosureStatus;
  closureError?: string;
}> => {
  const businessClosureStatus = await apiHandler();

  if (!businessClosureStatus) {
    return { closureError: 'Failed to fetch business closed status' };
  }

  return { businessClosureStatus };
};
