import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type BackToTopProps = {
  className?: string;
  label?: { en: string; cy: string };
};

const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();

  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const BackToTop = ({ className = '', label }: BackToTopProps) => {
  const { z } = useTranslation();

  return (
    <Link
      href="#main"
      className={`text-sm text-magenta-500 visited:text-magenta-500 ${className}`}
      onClick={onClick}
    >
      <span>
        {label ? z(label) : z({ en: 'Back to top', cy: "Nôl i'r brig" })}
      </span>
      <Icon type={IconType.ARROW_UP} className="text-magenta-500" />
    </Link>
  );
};
