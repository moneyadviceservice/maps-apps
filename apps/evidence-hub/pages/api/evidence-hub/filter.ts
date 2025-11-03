import { NextApiRequest, NextApiResponse } from 'next';

function addKeywordToParams(formData: any, params: URLSearchParams): void {
  const keywordValue =
    formData.keyword ||
    formData['keyword-mobile'] ||
    formData['keyword-desktop'];
  if (keywordValue) {
    params.set('keyword', keywordValue);
  }
}

function addYearToParams(formData: any, params: URLSearchParams): void {
  const yearValue =
    formData.year ||
    formData.yearOfPublication ||
    formData['yearOfPublication-mobile'] ||
    formData['yearOfPublication-desktop'];
  if (yearValue) {
    params.set('year', yearValue);
  }
}

function addTagFiltersToParams(formData: any, params: URLSearchParams): void {
  for (const key of Object.keys(formData)) {
    if (key.endsWith('[]') && formData[key]) {
      const groupName = key.slice(0, -2);
      const values = Array.isArray(formData[key])
        ? (formData[key] as string[])
        : [formData[key] as string];

      const filteredValues = values.filter(
        (value) => value && value.trim() !== '',
      );

      if (filteredValues.length > 0) {
        params.set(groupName, filteredValues.join(','));
      }
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = req.method === 'GET' ? req.query : req.body;
    const params = new URLSearchParams();

    addKeywordToParams(formData, params);
    addYearToParams(formData, params);
    addTagFiltersToParams(formData, params);

    const redirectUrl = `/en/evidence-library?${params.toString()}`;
    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('Error processing filter form:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
