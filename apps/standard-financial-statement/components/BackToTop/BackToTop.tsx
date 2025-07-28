import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { Button, Icon, IconType, Link } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

const ButtonSecondaryClasses = [
  'text-blue-600',
  'bg-transparent',
  'border-blue-600',
  'border-1',
  'py-1',
  'hover:bg-blue-600',
  'hover:text-white',
  'focus::not-active:bg-magenta-700',
  'active:not-focus:bg-blue-600',
  'focus::not-active:text-white',
  'active::not-focus:text-white',
];

export const BackToTop = ({
  url,
  containerClasses,
}: {
  url: string;
  containerClasses?: string;
}) => {
  const { z } = useTranslation();
  const [jsEnabled, setJsEnabled] = useState(false);

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  return (
    <div
      data-testid="top"
      className={twMerge(
        'flex items-center justify-center py-8 mt-12 border-t-1 border-b-1 border-slate-400',
        containerClasses,
      )}
    >
      <div className="flex gap-4 mr-auto">
        {jsEnabled && (
          <Button
            data-testid="print"
            onClick={() => window.print()}
            className={twMerge(ButtonSecondaryClasses)}
          >
            {z({
              en: 'Print',
              cy: 'Imprimer',
            })}
          </Button>
        )}
        <Link
          href={`mailto:?body=${url}`}
          asButtonVariant="primary"
          className={twMerge(ButtonSecondaryClasses)}
        >
          {z({
            en: 'Email',
            cy: 'E-bostio',
          })}
        </Link>
      </div>
      <div className="flex items-center justify-center gap-2 ml-auto">
        <Link
          href="#top"
          className="text-sm text-blue-600 visited:text-blue-600"
        >
          {z({
            en: 'Back to top',
            cy: 'Retour en haut',
          })}
        </Link>
        <Icon type={IconType.ARROW_UP} fill="text-blue-600" />
      </div>
    </div>
  );
};
