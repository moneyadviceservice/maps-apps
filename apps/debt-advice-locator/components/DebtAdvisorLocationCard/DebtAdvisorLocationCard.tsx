import { ProviderType } from 'utils/getOrgData/getData';

import {
  ExpandableSection,
  H3,
  Link,
  Paragraph,
} from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

export const DebtAdvisorLocationCard = ({
  provider,
  lang,
  number,
  selected,
}: {
  provider: ProviderType;
  lang: string;
  number: number;
  selected: boolean;
}) => {
  const { z } = useTranslation();
  return (
    <div
      className="max-w-[840px] border-1 border-slate-400 rounded-bl-[36px] p-4 mt-8 mb-6"
      id={`provider-${number}`}
    >
      <div className="flex">
        <span className="mr-4 relative flex items-center justify-center h-[70px]">
          <span className="absolute flex items-center font-bold text-lg top-[14px] text-white">
            {number}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="70"
            viewBox="0 0 54 70"
            fill="none"
          >
            <path
              d="M26.5 7C15.7476 7 7 15.7022 7 26.3987C7 42.3359 24.559 57.8971 25.3068 58.552C25.6477 58.8505 26.0737 59 26.5 59C26.9263 59 27.3523 58.8507 27.6934 58.552C28.4408 57.8973 46 42.3361 46 26.3987C46 15.7022 37.2524 7 26.5 7ZM26.5 20.9529C29.4868 20.9529 31.9167 23.3959 31.9167 26.3987C31.9167 29.4016 29.4868 31.8445 26.5 31.8445C23.5132 31.8445 21.0833 29.4016 21.0833 26.3987C21.0833 23.3959 23.5132 20.9529 26.5 20.9529Z"
              fill={selected ? '#0F19A0' : '#C82A87'}
            />
            <ellipse
              cx="27"
              cy="27"
              rx="8"
              ry="9"
              fill={selected ? '#0F19A0' : '#C82A87'}
            />
          </svg>
        </span>
        <div className="flex flex-col w-full md:flex-row">
          <H3 className="mb-0">{provider.name}</H3>
          <span className="md:ml-auto text-lg font-bold md:text-right max-w-[165px] w-full mt-1.5 mb-4 md:mb-0">
            {provider.distance}{' '}
            {z({ en: 'miles away', cy: 'Milltiroedd i ffwrdd' })}
          </span>
        </div>
      </div>
      <div className="ml-[70px]">
        {provider.notesEN && lang === 'en' && (
          <Paragraph className="mb-0">{provider.notesEN}</Paragraph>
        )}
        {provider.notesCY && lang === 'cy' && (
          <Paragraph className="mb-0">{provider.notesCY}</Paragraph>
        )}
        {provider.notesEN && !provider.notesCY && lang === 'cy' && (
          <Paragraph className="mb-0">{provider.notesCY}</Paragraph>
        )}
        <ExpandableSection
          open={selected}
          title={z({ en: 'Contact information', cy: 'Gwybodaeth gyswllt' })}
        >
          <dl>
            {provider.providesFaceToFace && (
              <>
                <dt className="font-bold text-[19px] mb-1 mt-4">
                  {z({
                    en: 'Address',
                    cy: 'Cyfeiriad',
                  })}
                </dt>
                <dd>
                  <Paragraph>
                    {provider.streetAddress && (
                      <span>{provider.streetAddress},</span>
                    )}{' '}
                    {provider.addressLocality && (
                      <span>{provider.addressLocality},</span>
                    )}{' '}
                    {provider.addressRegion && (
                      <span>{provider.addressRegion},</span>
                    )}{' '}
                    {provider.postcode && <span>{provider.postcode}</span>}
                  </Paragraph>
                </dd>
              </>
            )}
            {provider.telephoneNumber && (
              <>
                <dt className="font-bold text-[19px] mb-1 mt-4">
                  {z({
                    en: 'Telephone number',
                    cy: 'Rhif ffôn',
                  })}
                </dt>
                <dd>
                  <Link href={`tel:${provider.telephoneNumber}`}>
                    {provider.telephoneNumber}
                  </Link>
                </dd>
              </>
            )}
            {provider.websiteAddress && (
              <>
                <dt className="font-bold text-[19px] mt-4">
                  {z({
                    en: 'Website',
                    cy: 'Gwefan',
                  })}
                </dt>
                <dd>
                  <Link
                    href={provider.websiteAddress}
                    target="_blank"
                    withIcon={false}
                  >
                    {provider.name} (
                    {z({
                      en: 'opens in a new tab',
                      cy: 'yn agor mewn tab newydd',
                    })}
                    )
                  </Link>
                </dd>
              </>
            )}
          </dl>
        </ExpandableSection>
      </div>
    </div>
  );
};
