import { ContentCard } from '@maps-react/common/components/ContentCard';
import { Heading, Link } from '@maps-react/common/index';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { VideoWithTranscript } from '../../components/VideoWithTranscript';
import { HomepageTemplate } from '../../types/@adobe/homepage';

type Props = {
  page: HomepageTemplate;
  assetPath: string;
  lang: string;
};

export const HomepageLayout = ({ page, assetPath, lang }: Props) => {
  const { title, description, cards, video, content } = page;

  return (
    <div className="pb-16 max-w-[840px] mt-6">
      <Heading
        level="h2"
        className="text-blue-700 mb-8"
        data-testid="homepage-heading"
      >
        {title}
      </Heading>
      <div className="mb-12" data-testid="homepage-description">
        <RichTextAem>
          {description?.json && mapJsonRichText(description.json)}
        </RichTextAem>
      </div>

      {cards && cards.length > 0 && (
        <section className="mb-12" data-testid="cards-section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card, index) => {
              const imageSrc = card.image?.image?._path
                ? `${assetPath}${card.image.image._path}`
                : undefined;

              return (
                <Link
                  key={`card-${index}`}
                  href={
                    card.link.externalLink
                      ? card.link.linkTo
                      : `/${lang}/${card.link.linkTo}`
                  }
                  className="h-full no-underline rounded-bl-[36px]"
                >
                  <ContentCard
                    title={card.title}
                    image={
                      imageSrc
                        ? {
                            src: imageSrc,
                            alt: card.title,
                          }
                        : undefined
                    }
                    headingClassName="text-magenta-500 mb-2"
                    className="h-full"
                    testId={`card-${index}`}
                  >
                    <RichTextAem className="text-sm">
                      {card.description?.json &&
                        mapJsonRichText(card.description.json)}
                    </RichTextAem>
                  </ContentCard>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {video && (
        <section className="mb-12" data-testid="video-section">
          <VideoWithTranscript video={video} testId="homepage-video" />
        </section>
      )}

      {content && (
        <section className="mb-8" data-testid="content-section">
          <div data-testid="content">
            <RichTextAem>{mapJsonRichText(content.json)}</RichTextAem>
          </div>
        </section>
      )}
    </div>
  );
};
