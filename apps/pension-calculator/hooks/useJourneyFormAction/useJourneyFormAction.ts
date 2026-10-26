import { type MouseEvent, type SubmitEvent, useEffect } from 'react';

import { useRouter } from 'next/router';

import { JOURNEY_PAGES, type JourneyPage } from 'data/journey';
import { persistJourneyJson } from 'lib/persistJourneyJson';
import { journeyPath } from 'utils/journeyPath';

import { useContextLanguage } from '@maps-react/hooks/useLanguage';

type JourneyActionName = 'continue' | 'save';

type Options<TErrors> = {
  api: string;
  sessionId: string;
  pageTitle: string;
  continuePage: JourneyPage;
  body: object;
  errorMessage: string;
  onFailure?: (errors: TErrors | undefined) => void;
  onSuccess?: () => void;
};

export const useJourneyFormAction = <TErrors>({
  api,
  sessionId,
  pageTitle,
  continuePage,
  body,
  errorMessage,
  onFailure,
  onSuccess,
}: Options<TErrors>) => {
  const lang = useContextLanguage();
  const router = useRouter();

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const submit = async (action: JourneyActionName) => {
    try {
      const result = await persistJourneyJson<TErrors>(
        api,
        action,
        lang,
        sessionId,
        body,
      );

      if (!result.success) {
        onFailure?.(result.errors);
        return;
      }

      onSuccess?.();
      const fallback = journeyPath(
        lang,
        action === 'save' ? JOURNEY_PAGES.SAVE : continuePage,
        sessionId,
      );
      await router.push(result.redirectPath ?? fallback);
    } catch (error) {
      console.error(errorMessage, error);
    }
  };

  const handleContinue = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    await submit('continue');
  };

  const handleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await submit('save');
  };

  return { lang, handleContinue, handleSave };
};
