export const formatKeyTitleArrays = (
  formData: FormData,
  options: { key: string; en: string }[],
) => {
  return options
    .filter((opt) => formData.get(opt.key) === 'on')
    .map((opt) => ({
      key: opt.key,
      title: opt.en,
    }));
};
