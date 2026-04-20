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

  const isOtpStep = code !== undefined;
  const params = new URLSearchParams({ linkId });
  if (code !== undefined) {
    params.set('code', code);
  }

  let response: Response;
  try {
    response = await betaAccessFetch(
      `${serviceUrl}/verify-code?${params.toString()}`,
    );
  } catch {
    throw new Error(RESPONSE_NOT_OK);
  }

  if (!response.ok) {
    throw betaAccessResponseError(response);
  }

  const body: unknown = await response.json();
  if (typeof body !== 'object' || body === null) {
    throw new Error(RESPONSE_NOT_OK);
  }
  const r = body as Record<string, unknown>;
  const rcRaw = r.responseCode ?? r.ResponseCode;
  const tokenRaw = r.token ?? r.Token;
  const token =
    typeof tokenRaw === 'string' && tokenRaw.length > 0 ? tokenRaw : null;
  if (
    typeof rcRaw !== 'number' ||
    !Number.isInteger(rcRaw) ||
    rcRaw < VerifyCodeResponseCode.SUCCESS ||
    rcRaw > VerifyCodeResponseCode.LEGACY_LINK_ALREADY_USED
  ) {
    throw new Error(RESPONSE_NOT_OK);
  }
  const rc = rcRaw as VerifyCodeResponseCode;

  if (rc !== VerifyCodeResponseCode.SUCCESS) {
    return { responseCode: rc };
  }

  if (token) {
    return { token };
  }

  if (!isOtpStep) {
    return { responseCode: rc };
  }

  throw new Error(RESPONSE_NOT_OK);
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
