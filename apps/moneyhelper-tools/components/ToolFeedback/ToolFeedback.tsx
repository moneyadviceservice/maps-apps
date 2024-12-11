import { twMerge } from 'tailwind-merge';

import { useTranslation } from '@maps-react/hooks/useTranslation';

import styles from './styles/widget.module.scss';

export type ToolFeedbackProps = {
  className?: string;
  id: string;
};

export const ToolFeedback = ({ className, id }: ToolFeedbackProps) => {
  const { locale } = useTranslation();

  return (
    <div
      className={twMerge(
        `${styles.toolFeedbackWidget} mt-8`,
        locale === 'cy' ? styles.welshBackButton : '',
        className,
      )}
      id={id}
    >
      {/* Injected widget will appear here */}
    </div>
  );
};
