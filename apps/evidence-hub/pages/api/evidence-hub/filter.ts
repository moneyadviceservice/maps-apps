import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    const params = new URLSearchParams();

    // Get keyword - handle both mobile and desktop form field names
    const keywordValue =
      formData.keyword ||
      formData['keyword-mobile'] ||
      formData['keyword-desktop'];
    if (keywordValue) {
      params.set('keyword', keywordValue);
    }

    // Get year - handle both mobile and desktop form field names
    const yearValue =
      formData.yearOfPublication ||
      formData['yearOfPublication-mobile'] ||
      formData['yearOfPublication-desktop'];
    if (yearValue) {
      params.set('year', yearValue);
    }

    // Get tag filters - form data is already grouped by tag group
    // Form data will have structure like: { "topics[]": ["saving", "debt"], "client group[]": ["adult"] }
    for (const key of Object.keys(formData)) {
      if (key.endsWith('[]') && formData[key]) {
        // Extract group name by removing the [] suffix
        const groupName = key.slice(0, -2);

        // Handle both single values and arrays
        let values: string[];
        if (Array.isArray(formData[key])) {
          values = formData[key] as string[];
        } else {
          values = [formData[key] as string];
        }

        // Filter out empty values
        const filteredValues = values.filter(
          (value) => value && value.trim() !== '',
        );

        if (filteredValues.length > 0) {
          params.set(groupName, filteredValues.join(','));
        }
      }
    }

    // Redirect back to the evidence hub page with the filter parameters
    const redirectUrl = `/en/evidence-hub?${params.toString()}`;
    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error processing filter form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
