import { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useTranslation } from '@maps-react/hooks/useTranslation';

export type VerifyCodeErrorType =
  | 'empty'
  | 'invalid-length'
  | 'invalid'
  | 'too-many-attempts'
  | 'expired'
  | 'api-failure'
  | null;

const ERROR_KEYS: Record<Exclude<VerifyCodeErrorType, null>, string> = {
  empty: 'pages.verify-code.error-empty',
  'invalid-length': 'pages.verify-code.error-invalid-length',
  invalid: 'pages.verify-code.error-invalid',
  'too-many-attempts': 'pages.verify-code.error-too-many-attempts',
  expired: 'pages.verify-code.error-expired',
  'api-failure': 'pages.verify-code.error-api-failure',
};

export const useVerifyCode = (linkId: string) => {
  const router = useRouter();
  const { t } = useTranslation('en');
  const [code, setCode] = useState('');
  const [error, setError] = useState<VerifyCodeErrorType>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.sendError;
    const sendError = typeof raw === 'string' ? raw : raw?.[0];
    if (sendError === 'too-many-attempts') {
      setError('too-many-attempts');
    }
  }, [router.isReady, router.query.sendError]);

  const errorMessage = error ? t(ERROR_KEYS[error]) : null;

  const handleCodeChange = useCallback((value: string) => {
    const digitsOnly = value.replaceAll(/\D/g, '').slice(0, 6);
    setCode(digitsOnly);
    setError(null);
    setResendSuccess(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setResendSuccess(false);

      if (!code) {
        setError('empty');
        return;
      }

      if (!/^\d{6}$/.test(code)) {
        setError('invalid-length');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkId, code }),
        });
        const data: {
          success?: boolean;
          error?: string;
          redirect?: string;
        } = await res.json();

        if (data.redirect) {
          window.location.href = data.redirect;
          return;
        }

        if (data.success) {
          window.location.href = '/';
          return;
        }

        setError(
          (data.error ?? 'api-failure') as Exclude<VerifyCodeErrorType, null>,
        );
        setLoading(false);
      } catch {
        setError('api-failure');
        setLoading(false);
      }
    },
    [code, linkId],
  );

  const handleResend = useCallback(async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError(null);

    try {
      const res = await fetch(
        `/api/resend?linkId=${encodeURIComponent(linkId)}`,
      );
      const data: {
        success?: boolean;
        redirect?: string;
        error?: string;
      } = await res.json();

      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }

      if (data.success) {
        setResendSuccess(true);
        setError(null);
        setResendLoading(false);
        return;
      }

      if (data.error === 'too-many-attempts' || res.status === 429) {
        setError('too-many-attempts');
        setResendLoading(false);
        return;
      }

      setError('api-failure');
      setResendLoading(false);
    } catch {
      setError('api-failure');
      setResendLoading(false);
    }
  }, [linkId]);

  return {
    code,
    handleCodeChange,
    error,
    errorMessage,
    loading,
    resendLoading,
    resendSuccess,
    handleSubmit,
    handleResend,
  };
};
