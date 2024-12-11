export const isInOfficeHours = () => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(9, 0, 0, 0);

  const end = new Date(now);
  end.setHours(15, 30, 0, 0);

  return now >= start && now <= end;
};
