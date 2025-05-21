import Image from 'next/image';

import { OrganisationType } from 'types/@adobe/page';

import { H3, Link } from '@maps-react/common/index';

const ImageLink = ({
  org,
  assetPath,
}: {
  org: OrganisationType;
  assetPath: string;
}) => {
  return (
    <div className="flex flex-col">
      <div
        data-testid={'image-link'}
        className="border-1 border-[#7E82A5] rounded-bl-[24px]"
      >
        <Link
          href={'image'}
          tabIndex={-1}
          target="_blank"
          withIcon={false}
          className="mx-4 my-6"
        >
          <Image
            className="print:hidden"
            src={`${assetPath}${org.governanceLogo.image._path}`}
            alt={'image.alt'}
            width={264}
            height={158}
          />
        </Link>
      </div>
      <Link
        href={org.link.linkTo}
        target="_blank"
        withIcon={false}
        className="tracking-[0.18px] mt-2 text-magenta-700 visited:text-magenta-700 hover:text-magenta-700 hover:underline text-[18px] font-medium"
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
          <ImageLink key={o.link.text} org={o} assetPath={assetPath} />
        ))}
      </div>
    </>
  );
};
