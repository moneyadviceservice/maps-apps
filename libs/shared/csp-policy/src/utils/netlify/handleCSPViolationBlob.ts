export const saveDataToBlob = async (
  violations: string | undefined,
  functionPath = '/.netlify/functions/saveCSPViolationsDetails',
) => {
  const response = await fetch(functionPath, {
    method: 'POST',
    body: violations,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Status code ${response.status} -  ${text}`);
  }
  return text;
};
