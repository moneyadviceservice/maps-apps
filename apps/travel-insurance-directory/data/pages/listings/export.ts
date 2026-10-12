/**
 * Copy for PDF export (used server-side in API route; no useTranslation).
 */
export const exportCopy = {
  pdfTitle: {
    en: 'List of Travel Insurance Firms',
    cy: 'Rhestr o Gwmnïau Yswiriant Teithio',
  },
  columnHeaders: {
    en: { name: 'Name', website: 'Website', phone: 'Phone', email: 'Email' },
    cy: {
      name: 'Enw',
      website: 'Gwefan',
      phone: 'Ffôn',
      email: 'E-bost',
    },
  },
  downloadButton: {
    en: 'Download a list of all firms',
    cy: `Lawrlytho rhestr o’r holl gwmnïau`,
  },
} as const;
