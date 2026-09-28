import { ReactNode } from 'react';

import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import MapsLogoCy from '../../assets/maps-logo-cy.svg';
import MapsLogoEn from '../../assets/maps-logo-en.svg';
import { Container } from '../Container';
import { GridContainer } from '../GridContainer';
import { TrustpilotWidget } from '../TrustpilotWidget';
import PlainNumbersLink from './PlainNumbersLink';

type FooterLogosProps = {
  layout?: 'default' | 'grid';
  showTrustpilot: boolean;
};

const FooterLogosWrapper = ({
  layout,
  children,
}: {
  layout?: 'default' | 'grid';
  children: ReactNode;
}) =>
  layout === 'grid' ? (
    <GridContainer className="lg:max-w-none lg:px-0 lg:mx-0">
      <div className="col-span-12">{children}</div>
    </GridContainer>
  ) : (
    <Container className="lg:max-w-none lg:px-0 lg:mx-0 h-full">
      {children}
    </Container>
  );

export const FooterLogos = ({
  layout = 'default',
  showTrustpilot,
}: FooterLogosProps) => {
  const { z, locale } = useTranslation();

  return (
    <div
      className="lg:bg-[linear-gradient(90deg,rgb(255,255,255)_0%,rgb(255,255,255)_50%,rgb(243,241,243)_50%,rgb(243,241,243)_100%)]"
      {...(layout === 'grid' ? { 'data-testid': 'footer-grid' } : {})}
    >
      <div
        className={
          layout === 'grid'
            ? 'flex flex-col lg:grid lg:grid-cols-2 lg:max-w-[1272px] lg:mx-auto lg:px-8'
            : 'flex flex-col lg:grid lg:grid-cols-2 lg:container-auto'
        }
      >
        <FooterLogosWrapper layout={layout}>
          <div className="t-footer-branding md:flex md:space-x-8 lg:grid lg:grid-cols-3 lg:gap-2 lg:space-x-0 lg:py-12">
            <div className="pt-10 pb-8 t-footer-gov md:py-12 lg:p-0">
              <Link
                href={`https://www.moneyhelper.org.uk/${locale}`}
                aria-label={z({
                  en: 'Money and Pensions Service logo',
                  cy: 'Logo Gwasanaeth Arian a Phensiynau',
                })}
              >
                {z({
                  en: (
                    <MapsLogoEn
                      className="relative w-[150px] h-[86px]"
                      alt=""
                      aria-label="Money and Pensions Service logo"
                    />
                  ),
                  cy: (
                    <MapsLogoCy
                      className="relative w-[150px] h-[86px]"
                      alt=""
                      aria-label="Logo Gwasanaeth Arian a Phensiynau"
                    />
                  ),
                })}
              </Link>
            </div>
            <hr className="lg:hidden" />
            <div className="pt-8 pb-10 md:py-12 lg:col-span-2 lg:p-0">
              <div className="flex-grow space-y-4 text-sm t-footer-maps lg:text-md">
                <Image
                  src={z({
                    en: '/footer/gov.svg',
                    cy: '/footer/gov-cy.svg',
                  })}
                  className="md:pt-6 lg:pt-5 lg:h-[86px]"
                  width="188"
                  height="62"
                  alt=""
                  aria-label={z({
                    en: 'HM Government logo',
                    cy: 'Logo Llywodraeth EM',
                  })}
                />
              </div>
            </div>
          </div>
        </FooterLogosWrapper>
        <div className="bg-gray-100" data-testid="footer-partner-logos">
          <FooterLogosWrapper layout={layout}>
            <div
              className={twMerge(
                'flex flex-col items-start gap-4 py-8 sm:flex-row sm:items-end h-full',
                'lg:justify-end lg:py-0 lg:pt-10 lg:pb-12',
              )}
            >
              {showTrustpilot && <TrustpilotWidget />}
              <PlainNumbersLink />
            </div>
          </FooterLogosWrapper>
        </div>
      </div>
    </div>
  );
};

export default FooterLogos;
