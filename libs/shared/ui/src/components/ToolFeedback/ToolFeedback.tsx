import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import styles from './styles/widget.module.scss';

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
}: ToolFeedbackProps) => {
  const { locale } = useTranslation();

  const currentIds =
    process.env.ENVIRONMENT === 'production'
      ? surveyIds.production
      : surveyIds.development;
  return (
    <div
      className={twMerge(
        `${styles.toolFeedbackWidget} mt-8`,
        locale === 'cy' ? styles.welshBackButton : '',
        className,
      )}
      id={currentIds[locale]}
    >
      {/* Injected widget will appear here */}
    </div>
  );
};
