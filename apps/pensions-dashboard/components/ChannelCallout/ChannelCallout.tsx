import { Callout, CalloutVariant } from '@maps-react/common/components/Callout';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionsSummaryArrangement } from '../../lib/api/pension-data-service';
import { PensionsList } from '../PensionsList';

type ChannelCalloutProps = {
  data: PensionsSummaryArrangement[];
  variant: CalloutVariant;
  title: string;
  description?: string;
  icon: IconType;
  iconClasses?: string;
  link: string;
  linkText: string;
};

export const ChannelCallout = ({
  data,
  variant,
  title,
  description,
  icon,
  iconClasses,
  link,
  linkText,
}: ChannelCalloutProps) => {
  const { locale } = useTranslation();

  return (
    <Callout variant={variant} className="p-8 pt-6 mb-8 lg:mb-12">
      <Heading level="h4" component="h3" className="mb-3">
        {title}
      </Heading>

      {description && (
        <Paragraph className="mb-5 lg:mb-3">{description}</Paragraph>
      )}

      <PensionsList
        pensions={data}
        icon={<Icon type={icon} data-testid="icon" className={iconClasses} />}
      />

      <Link
        asButtonVariant="primary"
        href={`/${locale}${link}`}
        className="mt-8 max-lg:text-center max-lg:block max-lg:w-full lg:mt-6 lg:w-auto"
      >
        {linkText}
      </Link>
    </Callout>
  );
};
