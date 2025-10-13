import useTranslation from '@maps-react/hooks/useTranslation';

import { Heading } from '../Heading/Heading';
import { Link } from '../Link/Link';
import {
  ENCODED_BODY,
  ENCODED_NEW_LINE,
  shareToolContent,
} from './data/social-share-tool';

export type Props = {
  url: string;
  title: string;
  subject: string;
  withDivider?: boolean;
  emailBodyText?: string;
  xTitle: string;
};
// 'Baby Costs Calculator - Free online planning tool',
export function buildHref(
  link: string,
  name: string,
  subject: string,
  xTitle: string,
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
    case 'X':
      return 'https://twitter.com/intent/tweet?text='.concat(
        xTitle,
        `&url=${link}`,
      );
    default:
      return link;
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const SocialShareTool = ({
  url,
  title,
  subject,
  withDivider,
  emailBodyText,
  xTitle = '',
}: Props) => {
  const { z } = useTranslation();

  return (
    <>
      <Heading className="mb-4 md:mb-0 sm:mt-2" level="h6" component="h2">
        {title}
      </Heading>
      <div className="grid grid-flow-row gap-4 md:grid-cols-3">
        {shareToolContent.items.map((item, index) => {
          const { svg, name } = item;

          return (
            <Link
              href={buildHref(
                url,
                name,
                subject,
                xTitle,
                emailBodyText ??
                  z({
                    en: ENCODED_BODY.en,
                    cy: ENCODED_BODY.cy,
                  }),
              )}
              asButtonVariant="secondary"
              target="_blank"
              rel="noreferrer"
              scroll={true}
              title={name}
              key={index}
              withIcon={false}
              className={`t-social-sharing__button t-social-sharing__button--${name}`}
            >
              <div className="flex items-center justify-center gap-2">
                {svg}
                {withDivider && (
                  <hr
                    data-testid="social-divider"
                    className="h-[26px] bg-[#DB7BB4] w-[1px] ml-2 border-0"
                  />
                )}
                <p className="pl-2">{capitalizeFirstLetter(name)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};
