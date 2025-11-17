export const saveIncomeExpensesApi = async (
  data: Record<string, FormDataEntryValue>,
) => {
  if (!data || Object.keys(data).length === 0) return null;

  try {
    await fetch('/api/save-to-memory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  } catch (e) {
    throw new Error(String(e));
  }
};
