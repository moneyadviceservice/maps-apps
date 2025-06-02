import { ReactNode } from 'react';
import { ProviderType } from 'utils/getOrgData/getData';

import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Icon, IconType } from '@maps-react/common/index';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type LandingProps = {
  title: string;
  intro: ReactNode;
  className?: string;
};

export const content = (
  z: ReturnType<typeof useTranslation>['z'],
): LandingProps => {
  return {
    title: z({
      en: 'Advice providers for small business owners or self-employed',
      cy: 'Darparwyr cyngor ar gyfer perchnogion busnesau bach neu hunangyflogedig',
    }),
    intro: z({
      en: (
        <>
          <div className="inline-flex text-pink-800">
            <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
            <H2>Selected advice</H2>
          </div>
          <Paragraph className="mt-4 mb-8">
            Here's where you can get free debt advice if you're a small business
            owner or self-employed.
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <div className="inline-flex text-pink-800">
            <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
            <H2>Cyngor a ddewiswyd</H2>
          </div>
          <Paragraph>
            Dyma lle gallwch gael cyngor ar ddyledion am ddim os ydych chi'n
            berchennog busnes bach neu'n hunangyflogedig.
          </Paragraph>
        </>
      ),
    }),
  };
};

export const getBusinessProvider = (
  z: ReturnType<typeof useTranslation>['z'],
): ProviderType[] => {
  return [
    {
      name: 'Business Debtline (England and Wales)',
      streetAddress: 'Tricorn House, 51 - 53 Hagley Road',
      addressLocality: 'Edgbaston',
      addressRegion: 'Birmingham',
      postcode: 'B16 8TP',
      emailAddress: '',
      telephoneNumber: '0800 197 6026',
      websiteAddress: 'https://www.businessdebtline.org/',
      notesEN:
        'Business Debtline is a charity run by the Money Advice Trust. We are a free debt advice service for the self-employed and small businesses in England, Wales and Scotland. We have helped thousands of people deal with their debts. Our team of expert debt advisers care about improving your situation and will help you to take control of your debts.',
      notesCY: `Elusen yw Business Debtline sy'n cael ei redeg gan yr Money Advice Trust. Rydym yn wasanaeth cynghori ar ddyledion am ddim i'r hunangyflogedig a busnesau bach yng Nghymru, Lloegr a'r Alban. Rydym wedi helpu miloedd o bobl i ddelio â'u dyledion. Mae ein tîm o ymgynghorwyr dyledion arbenigol am wella eich sefyllfa a byddant yn eich helpu i reoli eich dyledion.`,
      providesFaceToFace: true,
      providesTelephone: true,
      providesWeb: true,
      availableInEngland: true,
      availableInNorthernIreland: false,
      availableInScotland: false,
      availableInWales: true,
      distance: 0,
    },
    {
      name: z({
        en: 'Advice NI Business Debt Service (Northern Ireland)',
        cy: 'Advice NI Business Debt Service (Gogledd Iwerddon)',
      }),
      streetAddress: "Advice NI, Forestview, Purdy's Lane",
      addressLocality: 'Newtownbreda',
      addressRegion: 'Belfast',
      postcode: 'BT8 7AR',
      emailAddress: '',
      telephoneNumber: '0800 915 4604',
      websiteAddress: 'https://www.adviceni.net/money-debt/business-debt',
      notesEN: '',
      notesCY: '',
      providesFaceToFace: true,
      providesTelephone: true,
      providesWeb: true,
      availableInEngland: false,
      availableInNorthernIreland: true,
      availableInScotland: false,
      availableInWales: false,
      distance: 0,
    },
    {
      name: z({
        en: 'Business Debtline (Scotland)',
        cy: 'Business Debtline (Yr Alban)',
      }),
      streetAddress: 'Tricorn House, 51 - 53 Hagley Road',
      addressLocality: 'Edgbaston',
      addressRegion: 'Birmingham',
      postcode: 'B16 8TP',
      emailAddress: '',
      telephoneNumber: '0800 197 6026',
      websiteAddress: 'https://businessdebtline.org/scotland-debt-advice-/',
      notesEN:
        'Business Debtline is a charity run by the Money Advice Trust. We are a free debt advice service for the self-employed and small businesses in England, Wales and Scotland. We have helped thousands of people deal with their debts. Our team of expert debt advisers care about improving your situation and will help you to take control of your debts.',
      notesCY: `Elusen yw Business Debtline sy'n cael ei redeg gan yr Money Advice Trust. Rydym yn wasanaeth cynghori ar ddyledion am ddim i'r hunangyflogedig a busnesau bach yng Nghymru, Lloegr a'r Alban. Rydym wedi helpu miloedd o bobl i ddelio â'u dyledion. Mae ein tîm o ymgynghorwyr dyledion arbenigol am wella eich sefyllfa a byddant yn eich helpu i reoli eich dyledion.`,
      providesFaceToFace: true,
      providesTelephone: true,
      providesWeb: true,
      availableInEngland: false,
      availableInNorthernIreland: false,
      availableInScotland: true,
      availableInWales: false,
      distance: 0,
    },
  ];
};

export const filterBusinessByCountry = (
  country: string,
  z: ReturnType<typeof useTranslation>['z'],
) => {
  const data = getBusinessProvider(z);
  return data.filter((provider: ProviderType) => {
    if (
      (country === '0' && provider.availableInEngland) ||
      (country === '2' && provider.availableInWales)
    ) {
      return provider;
    } else if (country === '3' && provider.availableInNorthernIreland) {
      return provider;
    } else if (country === '1' && provider.availableInScotland) {
      return provider;
    } else {
      return false;
    }
  });
};
