import { ReactNode } from 'react';

import { H2 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Icon, IconType, Link } from '@maps-react/common/index';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export type LandingProps = {
  title: string;
  intro: ReactNode;
  className?: string;
};

export const content = (
  z: ReturnType<typeof useTranslation>['z'],
  backURL: string,
): Record<string, LandingProps> => {
  return {
    '0': {
      title: z({
        en: 'Where to get free debt advice online',
        cy: 'Ble i gael cyngor ar ddyledion am ddim ar-lein',
      }),
      intro: z({
        en: (
          <>
            <div className="inline-flex text-pink-800">
              <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
              <H2>Selected advice</H2>
            </div>
            <Paragraph className="mt-4 mb-8">
              Here's where you can get free debt advice online. This usually
              includes self-help tools and the option to speak to an adviser
              using live chat.
            </Paragraph>
            <Paragraph className="mt-4 mb-8">
              You can also{' '}
              <Link href={backURL}>
                go back to view debt advice options by phone or in person.
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <div className="inline-flex text-pink-800">
              <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
              <H2>Cyngor a ddewiswyd</H2>
            </div>
            <Paragraph className="mt-4 mb-8">
              Dyma lle gallwch gael cyngor ar ddyledion am ddim ar-lein. Mae hyn
              fel arfer yn cynnwys teclynnau hunan-helpu a’r opsiwn i siarad ag
              ymgynghorydd drwy sgyrsio byw.
            </Paragraph>
            <Paragraph className="mt-4 mb-8">
              Gallwch hefyd{' '}
              <Link href={backURL}>
                fynd yn ôl i weld opsiynau cyngor ar ddyledion dros y ffôn neu
                wyneb yn wyneb.
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
    '1': {
      title: z({
        en: 'Where to get free debt advice by telephone',
        cy: 'Ble i gael cyngor ar ddyledion am ddim dros y ffôn',
      }),
      intro: z({
        en: (
          <>
            <div className="inline-flex text-pink-800">
              <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
              <H2>Selected advice</H2>
            </div>
            <Paragraph className="mt-4 mb-8">
              Here's where you can get free debt advice over the phone. Advisers
              are often available Monday to Saturday, including evenings.
            </Paragraph>
            <Paragraph className="mt-4 mb-8">
              You can also{' '}
              <Link href={backURL}>
                go back to view debt advice options online or in person.
              </Link>
            </Paragraph>
          </>
        ),
        cy: (
          <>
            <div className="inline-flex text-pink-800">
              <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
              <H2>Cyngor a ddewiswyd</H2>
            </div>
            <Paragraph className="mt-4 mb-8">
              Dyma lle gallwch gael cyngor ar ddyledion am ddim dros y ffôn. Mae
              ymgynghorwyr ar gael yn aml o ddydd Llun i ddydd Sadwrn, gan
              gynnwys nosweithiau.
            </Paragraph>
            <Paragraph className="mt-4 mb-8">
              Gallwch hefyd{' '}
              <Link href={backURL}>
                fynd yn ôl i weld opsiynau cyngor ar ddyledion ar-lein neu wyneb
                yn wyneb.
              </Link>
            </Paragraph>
          </>
        ),
      }),
    },
  };
};
