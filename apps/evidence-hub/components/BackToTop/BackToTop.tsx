import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

export const BackToTop = () => {
  const { z } = useTranslation();

  return (
    <div className="flex items-start justify-start gap-2">
      <Link href="#top" className="text-sm text-pink-600 visited:text-pink-600">
        <Icon type={IconType.ARROW_UP} className="text-pink-600" />
        <span>
          {z({
            en: 'Back to top',
            cy: 'Retour en haut',
          })}
        </span>
      </Link>
    </div>
  );
};
