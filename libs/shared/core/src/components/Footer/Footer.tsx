import { useEffect, useState } from 'react';

import Image from 'next/image';

import { twMerge } from 'tailwind-merge';

import FacebookIcon from '@maps-react/common/assets/images/facebook.svg';
import TwitterIcon from '@maps-react/common/assets/images/twitter.svg';
import YoutubeIcon from '@maps-react/common/assets/images/youtube.svg';
import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import MapsLogoCy from '../../assets/maps-logo-cy.svg';
import MapsLogoEn from '../../assets/maps-logo-en.svg';
import { Container } from '../Container';
import { GridContainer } from '../GridContainer';
import { FooterLinks } from './data/FooterLinks';
import SocialLink from './SocialLink';

interface CustomWindow extends Window {
  CookieControl: {
    load: (config: unknown) => void;
    open: () => void;
    getCookie: (name: string) => string | null;
    changeCategory: (categoryIndex: number, state: boolean) => void;
  };
}

type LayoutProps = {
  layout?: 'default' | 'grid';
};

const SmallFooterLogos = ({ layout = 'default' }: LayoutProps) => {
  const { z, locale } = useTranslation();

  const Branding = (
    <div className="t-footer-branding md:flex md:space-x-8">
      <div className="pt-10 pb-8 t-footer-gov md:py-12">
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
      <hr className="" />
      <div className="pt-8 pb-10 md:py-12">
        <div className="flex-grow space-y-4 text-sm t-footer-maps">
          <Image
            src={z({
              en: '/footer/gov.svg',
              cy: '/footer/gov-cy.svg',
            })}
            className="md:pt-6"
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
  );

  const Accessibility = (
    <div className="py-8 space-y-8 md:flex md:items-end md:gap-8">
      <div className="flex items-end gap-4">
        <Link href="https://plainnumbers.org.uk/community">
          <Image
            src="/footer/wwp-logo.svg"
            width="128"
            height="68"
            className=""
            alt="Plain Numbers Working Together logo"
          />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="lg:hidden">
      {layout === 'grid' ? (
        <GridContainer data-testid="footer-grid">
          <div className="col-span-12">{Branding}</div>
        </GridContainer>
      ) : (
        <Container>{Branding}</Container>
      )}
      <div className="bg-gray-100">
        {layout === 'grid' ? (
          <GridContainer data-testid="footer-grid">
            <div className="col-span-12">{Accessibility}</div>
          </GridContainer>
        ) : (
          <Container>{Accessibility}</Container>
        )}
      </div>
    </div>
  );
};

const LargeFooterLogos = ({ layout = 'default' }: LayoutProps) => {
  const { z, locale } = useTranslation();

  const Content = (
    <div className="grid grid-cols-2">
      <div className="grid grid-cols-3 gap-2 py-12 t-footer-branding">
        <div className="t-footer-gov">
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
        <div className="col-span-2 space-y-4 t-footer-maps text-md">
          <Image
            src={z({
              en: '/footer/gov.svg',
              cy: '/footer/gov-cy.svg',
            })}
            className="pt-5 h-[86px]"
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
      <div className="flex pl-4 bg-gray-100">
        <div className="flex-grow"></div>
        <div className="flex items-end gap-8 space-y-8">
          <div className="flex items-end gap-4 pt-10 pb-12">
            <Link href="https://plainnumbers.org.uk/community">
              <Image
                src="/footer/wwp-logo.svg"
                width="128"
                height="68"
                className=""
                alt="Plain Numbers Working Together logo"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="hidden lg:block"
      style={{
        background:
          'linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 50%, rgb(243,241,243) 50%, rgb(243,241,243) 100%)',
      }}
    >
      {layout === 'grid' ? (
        <GridContainer data-testid="footer-grid">
          <div className="col-span-12">{Content}</div>
        </GridContainer>
      ) : (
        <Container>{Content}</Container>
      )}
    </div>
  );
};

type FooterLinksSectionProps = {
  primaryLinkData: { link: string; label: string }[];
};

const socialLinkClasses = `group w-24 lg:w-40 relative flex`;

export const FooterLinksSection = ({
  primaryLinkData,
}: FooterLinksSectionProps) => {
  const { z } = useTranslation();
  return (
    <nav
      className="flex flex-col lg:flex-row"
      aria-label={z({ en: 'Footer navigation', cy: 'Llywio troedyn' })}
    >
      <section>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-[2px]">
          {primaryLinkData.map((item, key) => {
            const borderBottomClass = 'border-b-1 border-b-gray-400';
            const colStartClass =
              key === primaryLinkData.length - 1
                ? 'md:col-start-3 lg:col-start-2'
                : '';
            const borderTopClass =
              key === 0
                ? 'border-t-1 sm:border-t-none border-t-gray-400'
                : key === 1
                ? 'border-t-none sm:border-t-1 sm:border-t-gray-400'
                : key === 2
                ? 'border-t-none md:border-t-1 md:border-t-gray-400'
                : '';

            return (
              <li
                key={key}
                className={`text-white hover:text-pink-400 text-sm cursor-pointer hover:underline
                    ${borderBottomClass} ${colStartClass} ${borderTopClass}`}
              >
                <Link
                  variant="whiteText"
                  href={item.link}
                  className="flex items-center justify-between w-full py-2"
                >
                  {item.label}
                  <Icon
                    type={IconType.CHEVRON_RIGHT}
                    className="ml-2 mr-[6px]"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        className="flex flex-col pt-6 mt-6 text-sm text-white lg:mt-0 lg:pt-0 lg:ml-8 lg:w-1/4 sm:flex-row lg:flex-col sm:items-start"
        aria-labelledby="social-media-heading"
      >
        <p
          id="social-media-heading"
          className="mb-4 sm:w-1/6 lg:w-full sm:mb-0 lg:mb-4"
        >
          {z({
            en: 'Follow us:',
            cy: 'Dilynwch ni:',
          })}
        </p>
        <ul className="flex gap-4 sm:w-1/2 lg:w-full sm:mt-1 lg:mt-0">
          <li className={socialLinkClasses}>
            <SocialLink
              href="https://www.facebook.com/MoneyHelperUK"
              ariaLabel="Facebook link. Opens in new tab"
              Icon={FacebookIcon}
            />
          </li>
          <li className={socialLinkClasses}>
            <SocialLink
              href="https://x.com/MoneyHelperUK"
              ariaLabel="Twitter link. Opens in new tab"
              Icon={TwitterIcon}
            />
          </li>
          <li className={socialLinkClasses}>
            <SocialLink
              href="https://www.youtube.com/channel/UCDwjX78G1j_m2zWvPhZSTcw"
              ariaLabel="YouTube link. Opens in new tab"
              Icon={YoutubeIcon}
            />
          </li>
        </ul>
      </section>
    </nav>
  );
};

type FooterCopyrightSectionProps = {
  secondaryLinkData: { link: string; label: string }[];
  isJSEnabled: boolean;
};

export const FooterCopyrightSection = ({
  secondaryLinkData,
  isJSEnabled,
}: FooterCopyrightSectionProps) => {
  const { z } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="text-sm text-white t-footer-copy">
        {z(
          {
            en: '© {date} Money and Pensions Service, Bedford Borough Hall, 138 Cauldwell Street, Bedford, MK42 9AB. All rights reserved.',
            cy: '© {date} Money and Pensions Service, Bedford Borough Hall, 138 Cauldwell Street, Bedford, MK42 9AB. Cedwir pob hawl.',
          },
          { date: String(new Date().getFullYear()) },
        )}
      </div>
      <div>
        <ul className="flex flex-wrap">
          {secondaryLinkData.map((i, k) => (
            <li
              key={k}
              className="flex items-center pl-0 pr-2 text-sm text-white first:pl-0"
            >
              <Link variant="whiteText" href={i.link}>
                {i.label}
              </Link>
              <span className="inline-block pl-2 sm:pl-2 border-r border-gray-400 h-[15px] sm:border-r-1" />
            </li>
          ))}
          {isJSEnabled && (
            <li className="inline pl-0 pr-2 text-sm text-white first:pl-0">
              <Button
                variant="whiteLink"
                as="button"
                className="t-footer-cookie-preferences"
                data-testid="cookie-button"
                onClick={() => {
                  const customWindow = globalThis as unknown as CustomWindow;
                  if (typeof customWindow.CookieControl !== 'undefined') {
                    customWindow.CookieControl.open();
                  }
                }}
              >
                {z({
                  en: 'Cookie preferences',
                  cy: 'Dewisiadau cwcis',
                })}
              </Button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

type FooterProps = {
  className?: string;
  altPrivacyLink?: string;
  altCookieLink?: string;
  layout?: 'default' | 'grid';
};

export const Footer = ({
  className = '',
  altPrivacyLink,
  altCookieLink,
  layout = 'default',
}: FooterProps) => {
  const [isJSEnabled, setIsJSEnabled] = useState(false);
  const { primaryLinkData, secondaryLinkData } = FooterLinks(
    altPrivacyLink,
    altCookieLink,
  );

  useEffect(() => {
    setIsJSEnabled(true);
  }, [isJSEnabled]);

  return (
    <footer
      data-testid="footer"
      className={twMerge('border-t border-gray-100 t-footer', className)}
    >
      <div className="t-footer-primary">
        <SmallFooterLogos layout={layout} />
        <LargeFooterLogos layout={layout} />
      </div>

      {layout === 'grid' ? (
        <div className="t-footer-secondary pt-[50px] pb-12 bg-gray-800 border-b-1 border-b-gray-400">
          <GridContainer data-testid="footer-grid">
            <div className="flex flex-col col-span-12 lg:flex-row">
              <FooterLinksSection primaryLinkData={primaryLinkData} />
            </div>
          </GridContainer>
        </div>
      ) : (
        <div className="t-footer-secondary flex flex-col lg:flex-row pt-[50px] pb-12 bg-gray-800 border-b-1 border-b-gray-400">
          <Container className="flex flex-col lg:flex-row">
            <FooterLinksSection primaryLinkData={primaryLinkData} />
          </Container>
        </div>
      )}

      {layout === 'grid' ? (
        <div className="pt-6 pb-24 bg-gray-800 t-footer-secondary md:pb-6">
          <GridContainer data-testid="footer-grid">
            <div className="col-span-12">
              <FooterCopyrightSection
                secondaryLinkData={secondaryLinkData}
                isJSEnabled={isJSEnabled}
              />
            </div>
          </GridContainer>
        </div>
      ) : (
        <div className="pt-6 pb-24 bg-gray-800 t-footer-secondary md:pb-6">
          <Container>
            <FooterCopyrightSection
              secondaryLinkData={secondaryLinkData}
              isJSEnabled={isJSEnabled}
            />
          </Container>
        </div>
      )}
    </footer>
  );
};
