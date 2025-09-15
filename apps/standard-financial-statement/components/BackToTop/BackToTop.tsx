import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import {
  Button,
  commonLinkClasses,
  Icon,
  IconType,
  Link,
} from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

const ButtonSecondaryClasses = [
  'text-blue-600',
  'bg-transparent',
  'border-blue-600',
  'border-1',
  'py-1',
  'hover:bg-blue-600',
  'hover:border-green-500',
  'focus::not-active:bg-magenta-800',
  'active:not-focus:bg-blue-600',
  'hover:bg-blue-300',
  'active:bg-slate-300',
  'active:text-blue-600',
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
        <a
          href="#main"
          className={twMerge(
            commonLinkClasses,
            'text-sm text-blue-600 visited:text-blue-600',
          )}
        >
          {z({
            en: 'Back to top',
            cy: 'Retour en haut',
          })}
        </a>
        <Icon type={IconType.ARROW_UP} fill="text-blue-600" />
      </div>
    </div>
  );
};
