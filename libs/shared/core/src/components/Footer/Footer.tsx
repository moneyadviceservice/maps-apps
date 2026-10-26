import { useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import FacebookIcon from '@maps-react/common/assets/images/facebook.svg';
import TwitterIcon from '@maps-react/common/assets/images/twitter.svg';
import YoutubeIcon from '@maps-react/common/assets/images/youtube.svg';
import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Container } from '../Container';
import { GridContainer } from '../GridContainer';
import { FooterLinks } from './data/FooterLinks';
import FooterLogos from './FooterLogos';
import SocialLink from './SocialLink';

declare global {
  interface Window {
    CookieControl: {
      load: (config: unknown) => void;
      open: () => void;
      getCookie: (name: string) => string | null;
      changeCategory: (categoryIndex: number, state: boolean) => void;
    };
  }
}

type FooterLinksSectionProps = {
  primaryLinkData: { link: string; label: string }[];
};

const socialLinkClasses = `w-24 lg:w-40 relative flex`;

const borderTopClassByIndex: Record<number, string> = {
  0: 'border-t-1 sm:border-t-none border-t-gray-400',
  1: 'border-t-none sm:border-t-1 sm:border-t-gray-400',
  2: 'border-t-none md:border-t-1 md:border-t-gray-400',
};

export const FooterLinksSection = ({
  primaryLinkData,
}: FooterLinksSectionProps) => {
  const { z } = useTranslation();
  return (
    <div className="flex flex-col lg:flex-row">
      <nav aria-label={z({ en: 'Footer navigation', cy: 'Llywio troedyn' })}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-[2px]">
          {primaryLinkData.map((item, key) => {
            const borderBottomClass = 'border-b-1 border-b-gray-400';
            const colStartClass =
              key === primaryLinkData.length - 1
                ? 'md:col-start-3 lg:col-start-2'
                : '';
            const borderTopClass = borderTopClassByIndex[key] ?? '';

            return (
              <li
                key={key}
                className={`text-white hover:text-pink-400 text-sm cursor-pointer hover:underline
                    ${borderBottomClass} ${colStartClass} ${borderTopClass}`}
              >
                <Link
                  variant="whiteText"
                  onDarkBackground={true}
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
      </nav>
      <nav
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
      </nav>
    </div>
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
      <nav aria-label={z({ en: 'Legal navigation', cy: 'Llywio cyfreithiol' })}>
        <ul className="flex flex-wrap">
          {secondaryLinkData.map((i, k) => (
            <li
              key={k}
              className="flex items-center pl-0 pr-2 text-sm text-white first:pl-0"
            >
              <Link variant="whiteText" onDarkBackground={true} href={i.link}>
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
                  window.CookieControl?.open();
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
      </nav>
    </div>
  );
};

type FooterProps = {
  className?: string;
  altPrivacyLink?: string;
  altCookieLink?: string;
  altContactUs?: string;
  layout?: 'default' | 'grid';
  showTrustpilot?: boolean;
};

export const Footer = ({
  className = '',
  altPrivacyLink,
  altCookieLink,
  altContactUs,
  layout = 'default',
  showTrustpilot = false,
}: FooterProps) => {
  const [isJSEnabled, setIsJSEnabled] = useState(false);
  const { primaryLinkData, secondaryLinkData } = FooterLinks(
    altPrivacyLink,
    altCookieLink,
    altContactUs,
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
        <FooterLogos layout={layout} showTrustpilot={showTrustpilot} />
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
