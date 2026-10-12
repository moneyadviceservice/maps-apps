import { Icon, IconType, Link } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

export interface BackToTopProps {
  testId: string;
  className?: string;
}

export const BackToTop = ({ testId, className = 'mt-6' }: BackToTopProps) => {
  const { t } = useTranslation();

  return (
    <Link
      href="#top"
      className={className}
      data-testid={`back-to-top-${testId}`}
    >
      <Icon type={IconType.ARROW_UP} />
      <span>{t('back-to-top')}</span>
    </Link>
  );
};
