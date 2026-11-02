import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

interface RecommendedReadingProps {
  calculationType: string;
  isEmbedded?: boolean;
}

interface RecommendedReadingLink {
  prefix: string;
  text: string;
  href: string;
}
export interface RecommendedReadingSection {
  id: string;
  title: string;
  condition?: string;
  links: RecommendedReadingLink[];
}

export const RecommendedReading = ({
  calculationType,
  isEmbedded,
}: RecommendedReadingProps) => {
  const { t, tList } = useTranslation();

  return (
    <div className="t-recommended-reading">
      <H2 className="pb-5 text-[28px]" color="text-blue-700">
        {t('recommendedReading.title')}
      </H2>
      {tList('recommendedReading.sections').map(
        (section: RecommendedReadingSection) => {
          if (section.condition && section.condition !== calculationType) {
            return null;
          }

          return (
            <ExpandableSection
              key={section.id}
              testClassName="mb-[-1px]"
              variant="mainLeftIcon"
              title={section.title}
            >
              <ul className="pl-10 list-disc marker:text-blue-700 marker:mr-2 marker:pr-2 marker:leading-snug">
                {section.links.map((link, index) => (
                  <li key={`${section.id}-link-${index}`}>
                    {link.prefix}{' '}
                    <Link
                      asInlineText={true}
                      target={isEmbedded ? '_blank' : ''}
                      href={link.href}
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </ExpandableSection>
          );
        },
      )}
    </div>
  );
};
