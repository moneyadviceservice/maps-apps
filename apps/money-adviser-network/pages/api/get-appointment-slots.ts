import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = process.env.FETCH_APPOINTMENT_SLOTS_CODE;

  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const slotDate = `${day}/${month}/${year}`;

  if (!code) {
    return res.status(400).json({
      error: `Missing required parameters: FETCH_APPOINTMENT_SLOTS_CODE`,
    });
  }

  try {
    const response = await fetch(
      `${process.env.APPOINTMENTS_API}GetBookingSlots?code=${code}&slotDate=${slotDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Error from external API: ${response.statusText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error calling external API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
