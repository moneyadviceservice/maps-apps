import { useEffect } from 'react';

import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import styles from './styles/widget.module.scss';
declare global {
  interface Window {
    informizelyApi?: {
      showScript: (surveyId: string) => void;
    };
  }
}
export type ToolFeedbackProps = {
  className?: string;
  surveyIds?: {
    production: {
      en: string;
      cy: string;
    };
    development: {
      en: string;
      cy: string;
    };
  };
  overrideIzCr?: boolean;
};

const DEFAULT_SURVEY_IDS = {
  production: {
    en: 'informizely-embed-fgddnriui',
    cy: 'informizely-embed-ugeryrudd',
  },
  development: {
    en: 'informizely-embed-fjguluwfj',
    cy: 'informizely-embed-zjiieufr',
  },
};

export const ToolFeedback = ({
  className,
  surveyIds = DEFAULT_SURVEY_IDS,
  overrideIzCr,
}: ToolFeedbackProps) => {
  const { locale } = useTranslation();

  const currentIds =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? surveyIds.production[locale]
      : surveyIds.development[locale];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.informizelyApi) {
        const apiSurveyId = currentIds.replace('informizely-embed-', '');
        window.informizelyApi.showScript(apiSurveyId);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIds]);

  return (
    <div
      className={twMerge(
        `${styles.toolFeedbackWidget} mt-8`,
        locale === 'cy' ? styles.welshBackButton : '',
        overrideIzCr ? styles.overrideIzCr : '',
        className,
      )}
      id={currentIds}
    />
  );
};
