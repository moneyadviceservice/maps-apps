import type { NextApiRequest, NextApiResponse } from 'next';

import { PAGES } from 'CONSTANTS';

import { DataFromQuery } from '@maps-react/utils/pageFilter';

import { FORM_FIELDS } from '../../data/questions/types';
import { getCurrentPath } from '../../utils/getCurrentPath';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { urlData, cookieData, language, currentFlow } = req.body;

  const parsedUrlData: DataFromQuery = urlData ? JSON.parse(urlData) : {};
  const parsedCookieData: DataFromQuery = urlData ? JSON.parse(cookieData) : {};

  const currentPath = getCurrentPath(currentFlow);

  const rawSlot = parsedCookieData['t-5'];
  let formattedSlotDate = '';
  let slotType = '';

  if (rawSlot) {
    const match = rawSlot.match(/(AM|PM) - (\d{2}-\d{2}-\d{4})/);
    if (match) {
      slotType = match[1];
      const [day, month, year] = match[2].split('-');
      formattedSlotDate = `${day}/${month}/${year}`;
    } else {
      console.error(`Invalid slot format: ${rawSlot}`);
      return res.status(400).json({ error: 'Invalid slot format' });
    }
  }

  const {
    customerDetails,
    reference,
    securityQuestions,
    consentDetails,
    consentReferral,
  } = parsedCookieData;

  const payload = {
    slottype: slotType || 'digital',
    slot: formattedSlotDate,
    webformlink:
      'https://adviser.moneyhelper.org.uk/en/money-adviser-network/telephone', // Hardcoded value
    source: 'webform', // Hardcoded value
    contact: {
      contactfirstname: customerDetails?.[FORM_FIELDS.firstName] || '',
      contactlastname: customerDetails?.[FORM_FIELDS.lastName] || '',
      phone: customerDetails?.[FORM_FIELDS.telephone] || '',
      creditorreferencenumber: reference?.[FORM_FIELDS.customerReference] || '',
      agentdepartmentname: reference?.[FORM_FIELDS.departmentName] || '',
      referrerusername: 'username', // Replace with session username if available
    },
    case: {
      casenumber: 'CASE12345', // Replace with actual case number if available
      description: 'Customer inquiry regarding loan application', // Optional: Can be made dynamic or removed
      status: 'Test', // Replace with appropriate status in production
    },
    securityquestion1: securityQuestions?.[FORM_FIELDS.securityQuestion] || '',
    securityquestion1answer:
      securityQuestions?.[FORM_FIELDS.securityAnswer] || '',
    securityquestion2: 'What is your postcode?', // Hardcoded question
    securityquestion2answer: securityQuestions?.[FORM_FIELDS.postcode] || '',
    consentoffundertolisten: consentDetails?.value === 0,
    consentouserresearch: consentReferral?.value === 0,
    consenttofeedback: consentReferral?.value === 0,
  };

  const { BOOK_APPOINTMENT_SLOT_CODE: code, APPOINTMENTS_API: api } =
    process.env;

  if (!api || !code) {
    const missingParams = [];
    if (!api) missingParams.push('APPOINTMENTS_API');
    if (!code) missingParams.push('BOOK_APPOINTMENT_SLOT_CODE');

    return res.status(400).json({
      error: `Missing required parameter(s): ${missingParams.join(', ')}`,
    });
  }

  try {
    const response = await fetch(`${api}BookAppointment?code=${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload }),
    });

    if (response.status !== 200) {
      const errorText = await response.text();

      throw new Error(`Failed to book slot: ${response.status} ${errorText}`);
    }

    res.redirect(302, `/${language}/${currentPath}/${PAGES.CALL_SCHEDULED}`);
  } catch (error) {
    console.error('Error booking slot in catch:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred.';

    const parsedDataWithError: DataFromQuery = {
      ...parsedUrlData,
      ...{ error: errorMessage },
    };

    const queryString = Object.keys(
      parsedDataWithError as Record<string, string>,
    )
      .map((key) => {
        return `${key}=${encodeURIComponent(
          parsedDataWithError && key ? parsedDataWithError[key] : '',
        )}`;
      })
      .join('&');

    res.redirect(
      302,
      `/${language}/${currentPath}/${PAGES.CONFIRM_ANSWERS}?${queryString}`,
    );
  }
}
