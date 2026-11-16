import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer';
import { Heading } from '@maps-react/common/index';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';
import {
  extractPlainText,
  getCardKey,
  isExternalUrl,
  toTeaserCardImage,
} from 'utils/ui/homepageCardHelpers';

import { VideoWithTranscript } from '../../components/VideoWithTranscript';
import { HomepageTemplate } from '../../types/@adobe/homepage';

type Props = {
  page: HomepageTemplate;
  assetPath: string;
};

export const HomepageLayout = ({ page, assetPath }: Props) => {
  const { title, description, cards, video, contentTitle, content } = page;

  return (
    <div className="pb-16 max-w-[840px] md:mt-6">
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
          <TeaserCardContainer gridCols={2}>
            {cards.map((card) => {
              const href = card.link.linkTo || '';

              return (
                <TeaserCard
                  key={getCardKey(card)}
                  title={card.title}
                  description={extractPlainText(card.description)}
                  href={href}
                  image={toTeaserCardImage(card, assetPath)}
                  hrefTarget={isExternalUrl(href) ? '_blank' : '_top'}
                  headingComponent="h3"
                  imageClassName="w-full h-auto"
                />
              );
            })}
          </TeaserCardContainer>
        </section>
      )}

      {contentTitle && (
        <Heading
          level="h2"
          className="text-blue-700 mb-6"
          data-testid="content-heading"
        >
          {contentTitle}
        </Heading>
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
