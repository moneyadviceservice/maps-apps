export type EmergencyBannerContent = {
  en: string;
  cy: string;
  variant?: 'warning' | 'information' | 'negative' | 'positive' | 'default';
};

export const parseEmergencyBanner = (
  content: string | null | undefined,
): EmergencyBannerContent | null => {
  if (!content) {
    return null;
  }

  try {
    const validJsonContent = content.replace(/\n/g, '\\n');
    const parsedContent = JSON.parse(validJsonContent);

    if (parsedContent.en && parsedContent.cy) {
      return {
        en: parsedContent.en,
        cy: parsedContent.cy,
        variant: parsedContent.variant || 'default',
      } as EmergencyBannerContent;
    }

    return null;
  } catch (error) {
    console.error('Failed to parse emergency banner content:', error);
    return null;
  }
};
