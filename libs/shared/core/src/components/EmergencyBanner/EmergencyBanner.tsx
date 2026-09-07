import ReactMarkdown from 'react-markdown';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { commonLinkClasses } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { GridContainer } from '../GridContainer';

export type EmergencyBannerProps = {
  content: {
    en: string;
    cy: string;
    variant?: 'warning' | 'information' | 'negative' | 'positive' | 'default';
  };
  className?: string;
};

const markdownComponents = {
  a: ({ href, children, ...props }: any) => (
    <a
      href={href}
      className={['inline'].concat(commonLinkClasses).join(' ')}
      {...props}
    >
      {children}
    </a>
  ),
};

export const EmergencyBanner = ({
  content,
  className,
}: EmergencyBannerProps) => {
  const { z } = useTranslation();

  const variant = content.variant || 'default';

  const variantConfig = {
    default: { bg: '', icon: 'text-pink-600' },
    warning: { bg: 'bg-yellow-150', icon: 'text-yellow-600' },
    information: { bg: 'bg-gray-100', icon: 'text-blue-600' },
    negative: { bg: 'bg-red-100', icon: 'text-red-600' },
    positive: { bg: 'bg-green-100', icon: 'text-green-600' },
  } as const;

  const config = variantConfig[variant] || variantConfig.default;

  return (
    <GridContainer className="w-full">
      <div
        className={`col-span-12 mt-3 pt-3 pb-2 flex items-start ${config.bg} ${
          className ?? ''
        }`}
        data-testid="emergency-banner"
      >
        <Icon
          type={IconType.WARNING_SQUARE}
          className={`mr-3 flex-shrink-0 ${config.icon}`}
          width={32}
          height={39}
          aria-hidden="true"
        />
        <div className="flex-1 pl-1">
          <ReactMarkdown components={markdownComponents}>
            {z(content)}
          </ReactMarkdown>
        </div>
      </div>
    </GridContainer>
  );
};
