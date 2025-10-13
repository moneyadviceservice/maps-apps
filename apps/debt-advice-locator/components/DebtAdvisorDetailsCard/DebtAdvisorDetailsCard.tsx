import { ProviderType } from 'utils/getOrgData/getData';

import { H3, Link, Paragraph } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

export const DebtAdvisorDetailsCard = ({
  provider,
  lang,
  attributes = {
    showAddress: true,
    showPhone: true,
    showWebsite: true,
  },
}: {
  provider: ProviderType;
  lang: string;
  attributes?: {
    showAddress: boolean;
    showPhone: boolean;
    showWebsite: boolean;
  };
}) => {
  const { z } = useTranslation();
  return (
    <div className="max-w-[840px] border-1 border-slate-400 rounded-bl-[36px] p-4 md:p-8 mt-8 mb-6">
      <H3 className="mb-4">{provider.name}</H3>
      {provider.notesEN && lang === 'en' && (
        <Paragraph>{provider.notesEN}</Paragraph>
      )}
      {provider.notesCY && lang === 'cy' && (
        <Paragraph>{provider.notesCY}</Paragraph>
      )}
      {provider.notesEN && !provider.notesCY && lang === 'cy' && (
        <Paragraph>{provider.notesCY}</Paragraph>
      )}
      <dl>
        {attributes.showAddress && provider.providesFaceToFace && (
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
        {attributes.showPhone && provider.providesTelephone && (
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
        {attributes.showWebsite && provider.providesWeb && (
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
    </div>
  );
};
