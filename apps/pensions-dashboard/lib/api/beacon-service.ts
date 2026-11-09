const SUBMISSION_FAILED = 'Questionnaire submission failed';

export const postQuestionnaireSubmission = async (
  payload: object,
): Promise<void> => {
  const serviceUrl = process.env.MHPD_BEACON_SERVICE?.replace(/\/$/, '');
  const functionKey = process.env.MHPD_BEACON_SERVICE_API_KEY;
  if (!serviceUrl) {
    throw new Error('MHPD_BEACON_SERVICE is not configured');
  }
  if (!functionKey) {
    throw new Error('MHPD_BEACON_SERVICE_API_KEY is not configured');
  }

  let response: Response;
  try {
    response = await fetch(`${serviceUrl}/questionnaire-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-functions-key': functionKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Questionnaire submission request failed', error);
    throw new Error(SUBMISSION_FAILED);
  }

  if (response.status !== 200) {
    console.error('Questionnaire submission failed', `HTTP ${response.status}`);
    throw new Error(SUBMISSION_FAILED);
  }
};
