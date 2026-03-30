import { REQUEST_FAILED, RESPONSE_NOT_OK } from '../constants';
import { VerifyCodeResponseCode } from '../types';

export const BETA_ACCESS_SEND_CODE_RATE_LIMITED =
  'BETA_ACCESS_SEND_CODE_RATE_LIMITED';

export type ValidateBetaAccessTokenResult = 'valid' | 'invalid' | 'unavailable';

type ParsedVerifyCodeBody =
  | { token: string }
  | { responseCode: VerifyCodeResponseCode };

const betaAccessFetch = async (
  url: string,
  headers?: HeadersInit,
): Promise<Response> => {
  try {
    const init: RequestInit = {
      method: 'GET',
      signal: new AbortController().signal,
    };
    if (headers !== undefined) {
      init.headers = headers;
    }
    return await fetch(url, init);
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    throw error;
  }
};

const betaAccessResponseError = (response: Response): Error => {
  const statusText = (response.statusText ?? '').trim();
  const detail =
    statusText.length > 0
      ? `HTTP ${response.status} ${statusText}`
      : `HTTP ${response.status}`;
  return new Error(`${RESPONSE_NOT_OK} (${detail})`);
};

export const sendCode = async (linkId: string): Promise<void> => {
  const serviceUrl = process.env.MHPD_BETA_ACCESS_SERVICE;
  if (!serviceUrl) {
    throw new Error('MHPD_BETA_ACCESS_SERVICE is not configured');
  }

  if (!linkId) {
    throw new Error('Missing linkId');
  }

  const response = await betaAccessFetch(
    `${serviceUrl}/send-code?linkId=${encodeURIComponent(linkId)}`,
  );

  if (response.status === 429) {
    throw new Error(BETA_ACCESS_SEND_CODE_RATE_LIMITED);
  }

  if (!response.ok) {
    throw betaAccessResponseError(response);
  }
};

export const verifyCode = async (
  linkId: string,
  code?: string,
): Promise<ParsedVerifyCodeBody> => {
  const serviceUrl = process.env.MHPD_BETA_ACCESS_SERVICE;
  if (!serviceUrl) {
    throw new Error('MHPD_BETA_ACCESS_SERVICE is not configured');
  }

  if (!linkId) {
    throw new Error('Missing linkId');
  }

  const hasCode = code !== undefined;

  const params = new URLSearchParams({ linkId });
  if (code !== undefined) {
    params.set('code', code);
  }
  const verifyUrl = `${serviceUrl}/verify-code?${params.toString()}`;

  let response: Response;
  try {
    response = await betaAccessFetch(verifyUrl);
  } catch {
    throw new Error(RESPONSE_NOT_OK);
  }

  if (!response.ok) {
    throw betaAccessResponseError(response);
  }

  const body = await response.json();

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as { responseCode?: unknown }).responseCode !== 'number'
  ) {
    throw new Error(RESPONSE_NOT_OK);
  }

  const responseCode = (body as { responseCode: number }).responseCode;
  const token = (body as { token?: string | null }).token ?? null;

  if (
    !Number.isInteger(responseCode) ||
    responseCode < VerifyCodeResponseCode.SUCCESS ||
    responseCode > VerifyCodeResponseCode.CODE_VALIDATION_BACK_OFF
  ) {
    throw new Error(RESPONSE_NOT_OK);
  }

  const rc = responseCode as VerifyCodeResponseCode;

  if (!hasCode) {
    return { responseCode: rc };
  }

  if (rc === VerifyCodeResponseCode.SUCCESS) {
    if (!token) {
      throw new Error(RESPONSE_NOT_OK);
    }
    return { token };
  }

  return { responseCode: rc };
};

export const validateBetaAccessToken = async (
  token: string,
): Promise<ValidateBetaAccessTokenResult> => {
  const serviceUrl = process.env.MHPD_BETA_ACCESS_SERVICE;
  if (!serviceUrl) {
    return 'unavailable';
  }

  if (!token) {
    return 'invalid';
  }

  try {
    const response = await betaAccessFetch(`${serviceUrl}/validate`, {
      token,
    });

    if (response.ok) {
      return 'valid';
    }

    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403 ||
      response.status === 404
    ) {
      return 'invalid';
    }

    return 'unavailable';
  } catch (error) {
    console.error(REQUEST_FAILED, error);
    return 'unavailable';
  }
};
