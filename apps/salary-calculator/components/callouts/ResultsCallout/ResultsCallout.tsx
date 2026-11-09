import { ReactNode } from 'react';

import { H3 } from '@maps-react/common/components/Heading';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { SkipLink } from '@maps-react/common/components/SkipLink';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface ResultsCalloutProps {
  title: string;
  children: ReactNode;
  showSkipToContent?: boolean;
}

export const ResultsCallout = ({
  title,
  children,
  showSkipToContent = false,
}: ResultsCalloutProps) => {
  const { z } = useTranslation();

  return (
    <NotificationBox variant={NotificationBoxVariant.WARNING}>
      <H3 className="font-semibold mb-4 text-gray-800">{title}</H3>

      {children}

      {showSkipToContent && (
        <SkipLink
          href="#single-results-heading"
          className="focus:bottom-2 focus:right-2"
        >
          {z({ en: 'Skip to results', cy: 'Neidio at y canlyniadau' })}
        </SkipLink>
      )}
    </NotificationBox>
  );
};
