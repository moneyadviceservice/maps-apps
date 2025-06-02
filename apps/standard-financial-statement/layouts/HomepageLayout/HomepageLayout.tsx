import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer';
import { Heading, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { HomepageTemplate } from '../../types/@adobe/homepage';
import { transformImageForTeaserCard } from '../../utils/transformImageForTeaserCard';

type Props = {
  page: HomepageTemplate;
  assetPath: string;
};

export const HomepageLayout = ({ page, assetPath }: Props) => {
  const { hero, teaserCards } = page;
  const { title, description, image, link } = hero;
  const imageSrc = `${assetPath}${image?.image?._path}`;

  return (
    <>
      <Container
        className="pb-8 max-w-[1272px] bg-right mt-8"
        style={{
          backgroundImage: imageSrc ? `url(${imageSrc})` : 'none',
          backgroundColor: 'rgba(255,255,255,0.33)',
          backgroundBlendMode: 'lighten',
          width: 'auto',
          height: '100%',
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: '100%',
          backgroundPositionY: '0',
        }}
      >
        <div className={twMerge('lg:max-w-[840px] space-y-8 pb-6 pt-4')}>
          <Heading data-testid="homepage-heading">{title}</Heading>
          <RichTextAem>
            {description?.json && mapJsonRichText(description.json)}
          </RichTextAem>
          <Link
            asButtonVariant="primary"
            href={link?.linkTo ?? ''}
            title={link?.description ?? link?.text}
            data-testid="homepage-primary-link"
            className="text-blue-600 bg-green-300 hover:bg-green-500"
          >
            {link?.text}
          </Link>
        </div>
      </Container>
      <div className="w-full pt-8 pb-8 bg-blue-600">
        <Container className="pb-8 max-w-[1272px]">
          <div className={twMerge('w-full space-y-8 pt-8 ')}>
            <TeaserCardContainer gridCols={3}>
              {teaserCards.map((item) => (
                <TeaserCard
                  key={uuidv4()}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  image={transformImageForTeaserCard(item.image, assetPath)}
                  className="text-magenta-700 hover:text-magenta-700 hover:border-magenta-700"
                />
              ))}
            </TeaserCardContainer>
          </div>
        </Container>
      </div>
    </>
  );
};
