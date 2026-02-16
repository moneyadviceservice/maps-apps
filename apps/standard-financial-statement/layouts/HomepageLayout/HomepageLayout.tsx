import { buttonStyles } from 'components/RichTextWrapper';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';

import { TeaserCard } from '@maps-react/common/components/TeaserCard';
import { TeaserCardContainer } from '@maps-react/common/components/TeaserCardContainer';
import { Heading, Link } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import { mapJsonRichText } from '@maps-react/vendor/utils/RenderRichText';

import { HomepageTemplate } from '../../types/@adobe/homepage';
import { transformImageToStaticImageData } from '../../utils/transformImageToStaticImageData';

type Props = {
  page: HomepageTemplate;
  assetPath: string;
  lang: string;
};

export const HomepageLayout = ({ page, assetPath, lang }: Props) => {
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
            href={link?.linkTo ? `${lang}${link?.linkTo}` : ''}
            title={link?.description ?? ''}
            data-testid="homepage-primary-link"
            className={twMerge(buttonStyles)}
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
                  image={transformImageToStaticImageData(item.image, assetPath)}
                  className="text-magenta-800 hover:text-magenta-800 hover:border-magenta-800"
                />
              ))}
            </TeaserCardContainer>
          </div>
        </Container>
      </div>
    </>
  );
};
