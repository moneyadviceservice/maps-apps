import { additionalContent } from 'data/mortgage-affordability/additional-content';

import { H2 } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const OtherTools = () => {
  const { z } = useTranslation();
  const { heading, items, target } = additionalContent(z).otherTools;

  return (
    <div data-testid="other-tools-to-try">
      <H2 className="mb-8 md:text-[38px] text-blue-700 pt-8 border-t border-slate-400">
        {heading}
      </H2>
      <TeaserCardContainer gridCols={2}>
        {items.map(({ title, description, href, image }) => (
          <TeaserCard
            key={href}
            title={title}
            description={description}
            href={href}
            image={image}
            imageClassName="md:max-h-[200px]"
            hrefTarget={target}
            headingLevel="h5"
            headingComponent="h3"
          />
        ))}
      </TeaserCardContainer>
    </div>
  );
};
