import { summaryResultsOtherToolsData } from 'data/summaryResultsData';

import { H2, H3 } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import useTranslation from '@maps-react/hooks/useTranslation';

export const SummaryResultsOtherTools = () => {
  const { t } = useTranslation();

  const content = summaryResultsOtherToolsData({ t });

  return (
    <div>
      {/* Title */}
      <H2 className="mt-2 mb-8 text-blue-700">{content.title}</H2>

      {/* Tool cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {content.toolCards.map((toolCard) => (
          <TeaserCard
            href={toolCard.href}
            image={toolCard.image}
            title={toolCard.title}
            headingLevel="h5"
            headingComponent={H3}
            description={toolCard.description}
            key={toolCard.id}
            imageClassName="w-full h-auto aspect-video"
          />
        ))}
      </div>
    </div>
  );
};
