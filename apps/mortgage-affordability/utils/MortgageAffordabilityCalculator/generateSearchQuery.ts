import { FormData } from '@maps-react/pension-tools/types/forms';
import { addObjectKeyPrefix } from '@maps-react/pension-tools/utils/TabToolUtils';

/**
 * Builds the query string for links between the tool's pages from the parsed
 * form data rather than the raw page query, so that transient keys such as
 * validation errors never follow the user to another page.
 */
export const generateSearchQuery = (
  formData: FormData,
  isEmbed: boolean,
  resultData?: FormData | null,
): string => {
  const params = new URLSearchParams();

  const data: FormData = {
    ...addObjectKeyPrefix(formData, 'q-'),
    ...(resultData ? addObjectKeyPrefix(resultData, 'r-') : {}),
  };

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.append(key, value);
    }
  }

  if (isEmbed) {
    params.append('isEmbedded', 'true');
  }

  return params.toString();
};
