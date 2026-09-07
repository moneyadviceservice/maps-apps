import { H3, Heading } from '@maps-react/common/components/Heading';
import { TeaserCard } from '@maps-react/common/components/TeaserCard';

type Props = {
  content: {
    title: string;
    toolCards: {
      id: number;
      href: string;
      image: any;
      title: string;
      description: string;
    }[];
  };
  level?: 'h2' | 'h3';
  variant?: 'primary' | 'secondary';
};
export const OtherToolsToTry = ({
  content,
  level = 'h2',
  variant = 'secondary',
}: Props) => {
  return (
    <>
      {/* Title */}
      <Heading level={level} className="mt-2 mb-8" variant={variant}>
        {content.title}
      </Heading>

      {/* Tool cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            hrefTarget="_blank"
          />
        ))}
      </div>
    </>
  );
};
