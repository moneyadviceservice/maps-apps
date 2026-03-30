import { TagGroup } from 'types/@adobe/page';
import { YEAR_OPTIONS } from 'utils/filter/filterConstants';

/**
 * Track search button click event
 */
export const trackSearchButton = (keyword: string): void => {
  addEvent({
    event: 'searchButton',
    eventInfo: {
      elementId: 'keywordSearchFilter',
      value: keyword,
      clickAction: 'applyFilter',
    },
  });
};

/**
 * Track filter click events from form data
 * Maps form field names to TagGroup labels and Tag names for analytics
 */
export const trackFilterClicks = (
  formData: FormData,
  tags: TagGroup[],
): void => {
  if (typeof window !== 'undefined' && !window.adobeDataLayer) {
    window.adobeDataLayer = [];
  }
  for (const [key, value] of formData.entries()) {
    // Skip fields containing 'keyword' (case-insensitive)
    if (key.toLowerCase().includes('keyword')) continue;
    // Skip pagination and sort fields
    if (key === 'limit' || key === 'order') continue;

    let accordionType: string;
    let accordionOption: string;

    // Handle "year" field separately
    if (key === 'year') {
      accordionType = 'Year of publication';
      const yearOption = YEAR_OPTIONS.find((option) => option.value === value);
      accordionOption = yearOption?.label || (value as string);
    } else {
      // Strip [] suffix from form field name to match TagGroup.key
      const tagGroupKey = key.replace(/\[\]$/, '');
      const tagGroup = tags.find((tg) => tg.key === tagGroupKey);

      if (tagGroup) {
        accordionType = tagGroup.label;
        const tag = tagGroup.tags.find((t) => t.key === value);
        accordionOption = tag?.name || (value as string);
      } else {
        // Fallback to original values if TagGroup not found
        accordionType = key;
        accordionOption = value as string;
      }
    }

    addEvent({
      event: 'searchFilterClick',
      eventInfo: {
        elementId: 'keywordSearchFilter',
        accordionType,
        accordionOption,
        clickAction: 'applyFilter',
      },
    });
  }
};

function addEvent(event: {
  event: string;
  eventInfo: Record<string, unknown>;
}): void {
  if (typeof window !== 'undefined' && !window.adobeDataLayer) {
    window.adobeDataLayer = [];
  }
  window.adobeDataLayer?.push(event);
}
