import { useEffect, useState } from 'react';

import Image from 'next/image';

import FacebookIcon from '@maps-react/common/assets/images/facebook.svg';
import TwitterIcon from '@maps-react/common/assets/images/twitter.svg';
import YoutubeIcon from '@maps-react/common/assets/images/youtube.svg';
import { Button } from '@maps-react/common/components/Button';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Container } from '../Container';
import { FooterLinks } from './data/FooterLinks';
import SocialLink from './SocialLink';

interface CustomWindow extends Window {
  CookieControl: {
    load: (config: unknown) => void;
    open: () => void;
  };
}

const SmallFooterLogos = () => {
  const { z, locale } = useTranslation();
  return (
    <div className="pt-4 space-y-8 lg:hidden">
      <Container>
        <div className="space-y-4 t-footer-branding md:space-y-0 md:flex md:space-x-4">
          <div className="t-footer-gov">
            <Image
              src={z({
                en: '/footer/gov.png',
                cy: '/footer/gov-cy.svg',
              })}
              width="220"
              height="74"
              alt={z({
                en: 'H.M. Government logo',
                cy: 'Logo Llywodraeth E.M',
              })}
            />
          </div>
          <hr className="" />
          <div>
            <div className="flex-grow space-y-4 text-sm t-footer-maps">
              <div>
                {z({
                  en: 'MoneyHelper is provided by:',
                  cy: 'Darperir HelpwrArian gan:',
                })}
              </div>
              <Link href={`https://moneyandpensionsservice.org.uk/${locale}`}>
                <Image
                  src={z({
                    en: '/maps-logo.png',
                    cy: '/maps-logo-cy.svg',
                  })}
                  width="164"
                  height="60"
                  alt="MaPS logo"
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
      <div className="bg-gray-100 t-footer-accessibility">
        <Container>
          <div className="py-8 space-y-8 md:flex md:items-end md:gap-8">
            <div className="flex items-end gap-4">
              <Link
                href="https://www.w3.org/WAI/WCAG2AA-Conformance"
                aria-label="W3C WAI-AA WCAG 2.1"
              >
                <div className="p-0.5">
                  <Icon type={IconType.W3C} />
                </div>
              </Link>
              <Link href="https://clearest.co.uk/gold-standard/">
                <Image
                  src="/plain-language-commission.jpg"
                  width="68"
                  height="87"
                  className="p-0.5"
                  alt="Plain language commission logo"
                />
              </Link>
            </div>
            <Link
              href={`https://www.moneyhelper.org.uk/${locale}/contact-us/report-accessibility-problem`}
            >
              <div className="flex items-center space-x-2">
                <Icon type={IconType.ACCESSIBILITY} />
                <div>
                  {z({
                    en: 'Report an accessibility problem',
                    cy: 'Rhoi gwybod am broblem hygyrchedd',
                  })}
                </div>
              </div>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

const LargeFooterLogos = () => {
  const { z, locale } = useTranslation();
  return (
    <div
      className="hidden lg:block"
      style={{
        background:
          'linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 50%, rgb(243,241,243) 50%, rgb(243,241,243) 100%)',
      }}
    >
      <Container>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-2 py-8 t-footer-branding">
            <div className="t-footer-gov">
              <Image
                src={z({
                  en: '/footer/gov.png',
                  cy: '/footer/gov-cy.svg',
                })}
                width="220"
                height="74"
                alt={z({
                  en: 'H.M. Government logo',
                  cy: 'Logo Llywodraeth E.M',
                })}
              />
            </div>
            <div className="space-y-4 t-footer-maps text-md">
              <div>
                {z({
                  en: 'MoneyHelper is provided by:',
                  cy: 'Darperir HelpwrArian gan:',
                })}
              </div>
              <Link href={`https://moneyandpensionsservice.org.uk/${locale}`}>
                <Image
                  src={z({
                    en: '/maps-logo.png',
                    cy: '/maps-logo-cy.svg',
                  })}
                  width="164"
                  height="60"
                  alt="MaPS logo"
                />
              </Link>
            </div>
          </div>
          <div className="flex pl-4 bg-gray-100 t-footer-accessibility">
            <div className="flex-grow"></div>
            <div className="flex items-end gap-8 py-8 space-y-8">
              <div className="flex items-end gap-4">
                <Link
                  href="https://www.w3.org/WAI/WCAG2AA-Conformance"
                  aria-label="W3C WAI-AA WCAG 2.1"
                >
                  <div className="p-0.5">{<Icon type={IconType.W3C} />}</div>
                </Link>
                <Link href="https://clearest.co.uk/gold-standard/">
                  <Image
                    src="/plain-language-commission.jpg"
                    width="68"
                    height="87"
                    className="p-0.5"
                    alt="Plain language commission logo"
                  />
                </Link>
              </div>
              <Link
                href={`https://www.moneyhelper.org.uk/${locale}/contact-us/report-accessibility-problem`}
              >
                <div className="flex items-center space-x-2">
                  <Icon type={IconType.ACCESSIBILITY} />
                  <div>
                    {z({
                      en: 'Report an accessibility problem',
                      cy: 'Rhoi gwybod am broblem hygyrchedd',
                    })}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export const Footer = () => {
  const { z } = useTranslation();
  const [isJSEnabled, setIsJSEnabled] = useState(false);
  const { primaryLinkData, secondaryLinkData } = FooterLinks();

  useEffect(() => {
    setIsJSEnabled(true);
  }, [isJSEnabled]);

  return (
    <footer
      data-testid="footer"
      className="mt-8 border-t border-gray-100 t-footer"
    >
      <div className="t-footer-primary">
        <SmallFooterLogos />
        <LargeFooterLogos />
      </div>

      <div className="t-footer-secondary flex flex-col lg:flex-row pt-[50px] pb-12 bg-gray-800 border-b-1 border-b-gray-400">
        <Container className="flex flex-col lg:flex-row">
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-[2px]">
              {primaryLinkData.map((item, key) => {
                const borderBottomClass =
                  key !== primaryLinkData.length
                    ? 'border-b-1 border-b-gray-400'
                    : '';
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
                  <div
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
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col pt-6 mt-6 text-sm text-white lg:mt-0 lg:pt-0 lg:ml-8 lg:w-1/4 sm:flex-row lg:flex-col sm:items-start">
            <p className="mb-4 sm:w-1/6 lg:w-full sm:mb-0 lg:mb-4">
              {z({
                en: 'Follow us:',
                cy: 'Dilynwch ni:',
              })}
            </p>
            <div className="flex sm:w-1/2 lg:w-full sm:mt-1 lg:mt-0">
              <div className="flex w-full">
                <SocialLink
                  href="https://www.facebook.com/MoneyHelperUK"
                  ariaLabel="Facebook link. Opens in new tab"
                  Icon={FacebookIcon}
                />
                <SocialLink
                  href="https://x.com/MoneyHelperUK"
                  ariaLabel="Twitter link. Opens in new tab"
                  Icon={TwitterIcon}
                  className="mx-6 lg:mx-4"
                />
                <SocialLink
                  href="https://www.youtube.com/channel/UCDwjX78G1j_m2zWvPhZSTcw"
                  ariaLabel="YouTube link. Opens in new tab"
                  Icon={YoutubeIcon}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="pt-6 pb-24 bg-gray-800 t-footer-secondary md:pb-6">
        <Container>
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
                {secondaryLinkData.map((i, k) => {
                  return (
                    <li
                      key={k}
                      className="flex items-center pl-0 pr-2 text-sm text-white first:pl-0"
                    >
                      <Link variant="whiteText" href={i.link}>
                        {i.label}
                      </Link>
                      <span className="inline-block pl-2 sm:pl-2 border-r border-gray-400 h-[15px] sm:border-r-1" />
                    </li>
                  );
                })}
                {isJSEnabled && (
                  <li className="inline pl-0 pr-2 text-sm text-white first:pl-0">
                    <Button
                      variant="whiteLink"
                      as="button"
                      className="t-footer-cookie-preferences"
                      data-testid="cookie-button"
                      onClick={() => {
                        const customWindow = window as unknown as CustomWindow;
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
        </Container>
      </div>
    </footer>
  );
};
