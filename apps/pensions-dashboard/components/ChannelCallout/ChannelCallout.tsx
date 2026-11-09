import { ContentCard } from '@maps-react/common/components/ContentCard';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import useTranslation from '@maps-react/hooks/useTranslation';

import { PensionsSummaryArrangement } from '../../lib/api/pension-data-service';
import { PensionsList } from '../PensionsList';

type ChannelCalloutProps = {
  data: PensionsSummaryArrangement[];
  title: string;
  description?: string;
  icon: IconType;
  link: string;
  linkText: string;
  testId?: string;
};

export const ChannelCallout = ({
  data,
  title,
  description,
  icon,
  link,
  linkText,
  testId,
}: ChannelCalloutProps) => {
  const { locale } = useTranslation();

  return (
    <ContentCard title={title} testId={testId} className="p-4 mb-8 lg:mb-12">
      {description && (
        <Paragraph className="mb-5 lg:mb-3">{description}</Paragraph>
      )}

      <PensionsList
        pensions={data}
        icon={
          <Icon
            type={icon}
            data-testid="icon"
            className="w-5 h-5 text-gray-800"
          />
        }
      />

      <Link
        asButtonVariant="primary"
        href={`/${locale}${link}`}
        className="mt-8 max-lg:text-center max-lg:block max-lg:w-full lg:mt-6 lg:w-auto"
      >
        {linkText}
      </Link>
    </ContentCard>
  );
};
