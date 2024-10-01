import Image from 'next/image';
import { useState, useEffect } from 'react';

import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Button } from '@maps-react/common/components/Button';
import { Container } from '../Container';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { FooterLinks } from './data/FooterLinks';

const SmallFooterLogos = () => {
  const { z } = useTranslation();
  return (
    <div className="lg:hidden pt-4 space-y-8">
      <Container>
        <div className="t-footer-branding space-y-4 md:space-y-0 md:flex md:space-x-4">
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
            <div className="t-footer-maps flex-grow space-y-4 text-sm">
              <div>
                {z({
                  en: 'MoneyHelper is provided by:',
                  cy: 'Darperir HelpwrArian gan:',
                })}
              </div>
              <Link href="https://moneyandpensionsservice.org.uk/">
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
      <div className="t-footer-accessibility bg-gray-100">
        <Container>
          <div className="py-8 md:flex md:items-end space-y-8 md:gap-8">
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
              className="flex items-center space-x-2 text-pink-800 underline"
              href="https://www.moneyhelper.org.uk/en/contact-us/report-accessibility-problem"
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
  const { z } = useTranslation();
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
          <div className="t-footer-branding grid grid-cols-2 py-8">
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
            <div className="t-footer-maps space-y-4 text-md">
              <div>
                {z({
                  en: 'MoneyHelper is provided by:',
                  cy: 'Darperir HelpwrArian gan:',
                })}
              </div>
              <Link href="https://moneyandpensionsservice.org.uk/">
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
          <div className="t-footer-accessibility bg-gray-100 flex pl-4">
            <div className="flex-grow"></div>
            <div className="py-8 flex items-end space-y-8 gap-8">
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
              <Link href="https://www.moneyhelper.org.uk/en/contact-us/report-accessibility-problem">
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
  const { linkData } = FooterLinks();

  useEffect(() => {
    setIsJSEnabled(true);
  }, [isJSEnabled]);

  return (
    <footer
      data-testid="footer"
      className="t-footer mt-8 border-t border-gray-100"
    >
      <div className="t-footer-primary">
        <SmallFooterLogos />
        <LargeFooterLogos />
      </div>

      <div className="t-footer-secondary pt-6 pb-24 md:pb-6 bg-gray-800">
        <Container>
          <div className="space-y-3">
            <div className="t-footer-copy text-white text-sm">
              {z(
                {
                  en: '© {date} Money and Pensions Service, 120 Holborn, London EC1N 2TD. All rights reserved.',
                  cy: '© {date} Money and Pensions Service, 120 Holborn, London EC1N 2TD. Cedwir pob hawl.',
                },
                { date: String(new Date().getFullYear()) },
              )}
            </div>
            <div>
              <ul className="divide-x divide-gray-400">
                {linkData.map((i, k) => {
                  return (
                    <li
                      key={k}
                      className="inline pl-2 first:pl-0 pr-2 text-white text-sm"
                    >
                      <Link variant="whiteText" href={i.link}>
                        {i.label}
                      </Link>
                    </li>
                  );
                })}

                {isJSEnabled && (
                  <li className="inline pl-2 first:pl-0 pr-2 text-white text-sm">
                    <Button
                      variant="whiteLink"
                      as="button"
                      className="t-footer-cookie-preferences"
                      data-testid="cookie-button"
                      onClick={() => {
                        if (typeof window.CookieControl != 'undefined') {
                          window.CookieControl.open();
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
