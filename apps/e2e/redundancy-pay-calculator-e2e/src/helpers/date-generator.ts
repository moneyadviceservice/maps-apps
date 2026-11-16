export type RedundancyDate = {
  month: string;
  year: string;
  display: string;
};

//Increases current month count by 2, updates year if needed
export function getRedundancyDate(): RedundancyDate {
  const today = new Date();
  const redundancyDate = new Date(today.getFullYear(), today.getMonth() + 2, 1);

  return {
    month: String(redundancyDate.getMonth() + 1).padStart(2, '0'),
    year: String(redundancyDate.getFullYear()),
    display:
      redundancyDate.toLocaleString('en-GB', { month: 'long' }) +
      ` ${redundancyDate.getFullYear()}`,
  };
}
