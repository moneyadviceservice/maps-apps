import { useRouter } from 'next/router';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2 } from '@maps-react/common/components/Heading';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { getRecommendedReadingData } from '../../data/recommendedReadingData';

interface RecommendedReadingProps {
  calculationType: string;
  isEmbedded?: boolean;
}

export const RecommendedReading = ({
  calculationType,
  isEmbedded,
}: RecommendedReadingProps) => {
  const { z } = useTranslation();
  const router = useRouter();
  const { language } = router.query;

  const recommendedReadingData = getRecommendedReadingData(
    z,
    language,
    isEmbedded,
  );

  return (
    <div className="lg:max-w-4xl t-recommended-reading">
      <H2 className="pb-5 text-[28px]" color="text-blue-700">
        {z(recommendedReadingData.title)}
      </H2>
      {recommendedReadingData.sections.map((section) => {
        if (section.condition && section.condition !== calculationType) {
          return null;
        }

        return (
          <ExpandableSection
            key={section.id}
            testClassName="mb-[-1px]"
            variant="mainLeftIcon"
            title={z(section.title)}
          >
            <ul className="pl-10 list-disc marker:text-blue-700 marker:mr-2 marker:pr-2 marker:leading-snug">
              {section.links.map((linkContent, index) => (
                <li key={`${section.id}-link-${index}`}>
                  <span>{linkContent}</span>
                </li>
              ))}
            </ul>
          </ExpandableSection>
        );
      })}
    </div>
  );
};
