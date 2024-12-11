import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

import {
  ENCODED_BODY,
  ENCODED_NEW_LINE,
  shareToolContent,
} from '../../data/social-share-tool';

export type Props = {
  url: string;
  title: string;
  subject: string;
};

function buildHref(
  link: string,
  name: string,
  subject: string,
  emailBodyText: string,
) {
  switch (name) {
    case 'email':
      return `mailto:?subject=${subject}&body=${emailBodyText}`.concat(
        `${ENCODED_NEW_LINE}${ENCODED_NEW_LINE}`,
        link,
      );
    case 'facebook':
      return 'https://www.facebook.com/sharer.php?u='.concat(link);
    case 'twitter':
      return 'https://twitter.com/intent/tweet?text='.concat(
        'Baby Costs Calculator - Free online planning tool',
        `&url=${link}`,
      );
    default:
      return link;
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const SocialShareTool = ({ url, title, subject }: Props) => {
  const { z } = useTranslation();
  const emailBodyText = z({
    en: ENCODED_BODY.en,
    cy: ENCODED_BODY.cy,
  });
  return (
    <>
      <Heading className="t-social-sharing__title" level="h6" component="h2">
        {title}
      </Heading>
      <div className="grid grid-flow-row gap-4 t-social-sharing__button-container sm:grid-cols-3">
        {shareToolContent.items.map((item, index) => {
          const { svg, name } = item;

          return (
            <Link
              href={buildHref(url, name, subject, emailBodyText)}
              asButtonVariant="secondary"
              target="_blank"
              rel="noreferrer"
              scroll={true}
              title={name}
              key={index}
              className={`t-social-sharing__button t-social-sharing__button--${name}`}
            >
              <div className="flex items-center justify-center gap-2">
                {svg}
                <p className="pl-2">{capitalizeFirstLetter(name)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};
