import Image from 'next/image';
import { Container } from '@maps-react/core/components/Container';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';

const SmallFooterLogos = () => {
  return (
    <div className="lg:hidden pt-4 space-y-8">
      <Container>
        <div className="t-footer-branding space-y-4 md:space-y-0 md:flex md:space-x-4">
          <div className="t-footer-gov">
            <Image
              src={'/footer/gov.png'}
              width="220"
              height="74"
              alt="H.M. Government logo"
            />
          </div>
          <hr className="" />
          <div>
            <div className="t-footer-maps flex-grow space-y-4 text-sm">
              <div>MoneyHelper is provided by:</div>
              <Link href="/">
                <Image
                  src={'/maps-logo.png'}
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
              <Link href="/" aria-label="W3C WAI-AA WCAG 2.1">
                <div className="p-0.5">
                  <Icon type={IconType.W3C} />
                </div>
              </Link>
              <Link href="/">
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
              href="/"
            >
              <div className="flex items-center space-x-2">
                <Icon type={IconType.ACCESSIBILITY} />
                <div>Report an accessibility problem</div>
              </div>
            </Link>
          </div>
        </Container>
      </div>
    </div>
  );
};

const LargeFooterLogos = () => {
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
                src={'/footer/gov.png'}
                width="220"
                height="74"
                alt={'H.M. Government logo'}
              />
            </div>
            <div className="t-footer-maps space-y-4 text-md">
              <div>MoneyHelper is provided by:</div>
              <Link href="/">
                <Image
                  src={'/maps-logo.png'}
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
                <Link href="/" aria-label="W3C WAI-AA WCAG 2.1">
                  <div className="p-0.5">{<Icon type={IconType.W3C} />}</div>
                </Link>
                <Link href="/">
                  <Image
                    src="/plain-language-commission.jpg"
                    width="68"
                    height="87"
                    className="p-0.5"
                    alt="Plain language commission logo"
                  />
                </Link>
              </div>
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <Icon type={IconType.ACCESSIBILITY} />
                  <div>Report an accessibility problem</div>
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
  const linkData = [
    {
      link: '/',
      label: 'About us',
    },
    {
      link: '/',
      label: 'Terms & conditions',
    },
    {
      link: '/',
      label: 'Privacy notice',
    },
    {
      link: '/',
      label: 'Accessibility',
    },
    {
      link: '/',
      label: 'Cookies',
    },
    {
      link: '/',
      label: 'Report a problem',
    },
    {
      link: '/',
      label: 'Contact us',
    },
  ];

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
              © 2024 Money and Pensions Service, 120 Holborn, London EC1N 2TD.
              All rights reserved.
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
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
