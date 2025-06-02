export const formatOrganisationMembership = (formData: FormData) => {
  const entries = Array.from(formData.entries());
  const memberships: { key: string; title: string }[] = [];

  const keyPattern = /^organisation_membership\[(\d+)\]\.key$/;
  entries.forEach(([entryKey, entryValue]) => {
    const match = keyPattern.exec(entryKey);
    if (match) {
      const key = entryValue.toString();
      const title =
        formData.get(`organisation_membership[${key}].title`)?.toString() ?? '';
      if (key && title) {
        memberships.push({ key, title });
      }
    }
  });

  return memberships;
};
