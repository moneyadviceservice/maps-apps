import { useCallback } from 'react';

import Image from 'next/image';

import { OrganisationType } from 'types/@adobe/page';

import { H3, Link } from '@maps-react/common/index';
import { useAnalytics } from '@maps-react/hooks/useAnalytics';

const ImageLink = ({
  org,
  assetPath,
}: {
  org: OrganisationType;
  assetPath: string;
}) => {
  const { addEvent } = useAnalytics();

  const trackLinkClick = useCallback(() => {
    addEvent({
      event: 'externalClicks',
      eventInfo: {
        linkText: org.link.text,
        destinationURL: org.link.linkTo,
      },
    });
  }, [addEvent, org]);

  if (!org.link && !org.governanceLogo) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div
        data-testid={'image-link'}
        className="border-1 border-[#7E82A5] rounded-bl-[24px]"
      >
        <Link
          href={org.link.linkTo}
          tabIndex={-1}
          onClick={trackLinkClick}
          target="_blank"
          withIcon={false}
          className="mx-4 my-6"
        >
          <Image
            src={`${assetPath}${org.governanceLogo.image._path}`}
            alt={org.link.text}
            width={264}
            height={158}
          />
        </Link>
      </div>
      <Link
        href={org.link.linkTo}
        target="_blank"
        withIcon={false}
        onClick={trackLinkClick}
        className="tracking-[0.18px] mt-2 text-magenta-800 visited:text-magenta-800 hover:text-magenta-800 hover:underline text-[18px] font-medium"
      >
        <span className="flex">{org.link.text}</span>
      </Link>
    </div>
  );
};

export const ImageLinkGroup = ({
  title,
  org,
  assetPath,
}: {
  title: string;
  org: OrganisationType[];
  assetPath: string;
}) => {
  return (
    <>
      {title && <H3 className="mt-8 md:text-4xl">{title}</H3>}
      <div className="grid grid-cols-2 gap-6 pt-12 md:grid-cols-3" id="who">
        {org.map((o) => (
          <ImageLink key={o?.link?.text} org={o} assetPath={assetPath} />
        ))}
      </div>
    </>
  );
};
