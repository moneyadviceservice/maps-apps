export const formatOrganisationType = (
  formData: FormData,
  options: { value: string; en: string }[],
) => {
  const selectedKey = formData.get('type')?.toString();
  if (!selectedKey) return undefined;

  const match = options.find((opt) => opt.value === selectedKey);
  if (!match) return undefined;

  const result: { title: string; type_other?: string } = {
    title: match.en,
  };

  if (selectedKey === 'other') {
    result.type_other = formData.get('type_other')?.toString() ?? '';
  } else {
    result.type_other = '';
  }

  return result;
};
