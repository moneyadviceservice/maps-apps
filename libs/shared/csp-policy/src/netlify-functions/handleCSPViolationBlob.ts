export const saveDataToBlob = async (violations: string | undefined) => {
  const response = await fetch('/.netlify/functions/saveCSPViolationsDetails', {
    method: 'POST',
    body: violations,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Status code ${response.status} -  ${text}`);
  }
  return text;
};
