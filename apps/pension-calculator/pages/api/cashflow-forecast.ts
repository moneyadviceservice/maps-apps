import type { NextApiRequest, NextApiResponse } from 'next';

import { mockCashflowForecastRequest } from 'data/mock/cashflow-forecast-request';
import { getAccessToken } from 'lib/api/ev/getAccessToken';

const CASHFLOW_FORECAST_API_URL = process.env.EV_API_CASHFLOW_FORECAST_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Below line to be uncommented when we fully integrate with the front-end form and remove mock data usage
  // if (req.method !== 'POST') return res.status(405).end();
  if (!CASHFLOW_FORECAST_API_URL) {
    return res.status(500).json({ error: 'Missing cashflow forecast API URL' });
  }

  try {
    const token = await getAccessToken();

    // Make cashflow forecast API call with the token
    const apiResponse = await fetch(CASHFLOW_FORECAST_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // mockData (mockCashflowForecastRequest) only for PoC, replace with req.body when form data is built/ready
      body: JSON.stringify(mockCashflowForecastRequest ?? req.body),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API call failed:', errorText);
      return res.status(apiResponse.status).json({ error: errorText });
    }

    const forecastData = await apiResponse.json();

    return res.status(200).json(forecastData);
  } catch (error) {
    console.error('Error in cashflow-forecast handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
