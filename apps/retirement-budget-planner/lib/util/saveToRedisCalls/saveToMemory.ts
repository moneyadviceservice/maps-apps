export const saveIncomeExpensesApi = async (
  data: Record<string, FormDataEntryValue>,
) => {
  if (!data || Object.keys(data).length === 0) return null;
  const { sessionId } = data;

  if (typeof sessionId !== 'string') {
    throw new TypeError('sessionId must be a string');
  }
  try {
    await fetch(
      `/api/cache-to-memory?${new URLSearchParams({
        sessionId: sessionId,
      }).toString()}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, dynamic: true }),
      },
    );
  } catch (e) {
    throw new Error(String(e));
  }
};
