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
  location: string,
  noResults: boolean,
): LandingProps => {
  return {
    title: z({
      en: 'Where to get local debt advice',
      cy: 'Ble i gael cyngor lleol ar ddyledion',
    }),
    intro: z({
      en: (
        <>
          <div className="inline-flex text-pink-800">
            <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
            <H2 className="">
              {noResults && <span>No results for “{location}”</span>}
              {!noResults && <span>Results for “{location}”</span>}
            </H2>
          </div>
          {!noResults && (
            <Paragraph className="mt-4 mb-8">
              Here's where you can get free help from local debt advisers
              face-to-face. We list the eight closest to the location you
              entered, with the nearest first.
            </Paragraph>
          )}
          <Paragraph className="mt-4 mb-8">
            You can also{' '}
            <Link href={backURL}>
              go back to view debt advice options online or by phone.
            </Link>
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <div className="inline-flex text-pink-800">
            <Icon type={IconType.ARROW_CURVED} className="mr-[6px]" />
            <H2>
              {noResults && <span>Dim canlyniadau ar gyfer “{location}”</span>}
              {!noResults && <span>Canlyniadau ar gyfer “{location}”</span>}
            </H2>
          </div>
          {!noResults && (
            <Paragraph className="mt-4 mb-8">
              Dyma lle gallwch gael cymorth am ddim gan gynghorwyr dyled lleol
              wyneb yn wyneb. Rydyn ni'n rhestru'r wyth agosaf at y lleoliad y
              gwnaethoch chi ei nodi, gyda'r agosaf yn gyntaf.
            </Paragraph>
          )}
          <Paragraph className="mt-4 mb-8">
            Gallwch hefyd{' '}
            <Link href={backURL}>
              fynd yn ôl i weld opsiynau cyngor ar ddyledion ar-lein neu dros y
              ffôn.
            </Link>
          </Paragraph>
        </>
      ),
    }),
  };
};
