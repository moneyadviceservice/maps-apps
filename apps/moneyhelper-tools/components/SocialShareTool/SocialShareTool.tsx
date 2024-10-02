import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  shareToolContent,
  ENCODED_NEW_LINE,
  ENCODED_BODY,
} from '../../data/social-share-tool';

export type Props = {
  url: string;
  title: string;
  toolName: string;
};

function buildHref(link: string, name: string, toolName: string) {
  switch (name) {
    case 'email':
      return `mailto:?subject=${toolName}&body=${ENCODED_BODY}`.concat(
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

export const SocialShareTool = ({ url, title, toolName }: Props) => {
  return (
    <>
      <Heading className="t-social-sharing__title" level="h6" component="h2">
        {title}
      </Heading>
      <div className="t-social-sharing__button-container grid sm:grid-cols-3 grid-flow-row gap-4">
        {shareToolContent.items.map((item, index) => {
          const { svg, name } = item;

          return (
            <Link
              href={buildHref(url, name, toolName)}
              asButtonVariant="secondary"
              target="_blank"
              rel="noreferrer"
              scroll={true}
              title={name}
              key={name.replaceAll(' ', '-')}
              className={`t-social-sharing__button t-social-sharing__button--${name}`}
            >
              <div className="flex justify-center gap-2 items-center">
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
