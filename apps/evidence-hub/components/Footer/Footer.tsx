import { twMerge } from 'tailwind-merge';
import { LinkGroup } from 'types/@adobe/components';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/index';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

export const Footer = ({ footerLinks }: { footerLinks: LinkGroup[] }) => {
  const { z } = useTranslation();
  return (
    <footer data-testid="footer" className={twMerge('relative z-1')}>
      <div className="flex flex-col py-8 bg-gray-800 md:py-6">
        <Container className="max-w-[1200px]">
          <nav
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            aria-label="Footer navigation"
          >
            {footerLinks?.map((linkGroup, groupIndex) => {
              return (
                <div
                  key={`footer-group-${groupIndex}`}
                  className="flex flex-col"
                >
                  {linkGroup.title && (
                    <h3 className="mb-4 text-lg font-semibold text-white">
                      {linkGroup.title}
                    </h3>
                  )}
                  <ul className="flex flex-col pl-6 space-y-1 text-white list-disc">
                    {linkGroup.childLinks?.map((link, linkIndex) => {
                      return (
                        <li key={`footer-link-${groupIndex}-${linkIndex}`}>
                          <Link
                            className={twMerge(
                              'no-underline text-sm text-white visited:text-gray-100 hover:text-green-300 hover:underline transition-colors duration-200',
                            )}
                            href={`${link.linkTo}`}
                          >
                            {link.text}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </nav>
          <div className="pt-4 pb-10 mt-6 text-center border-t border-white">
            <Paragraph className="m-0 text-white">
              {z({
                en: `Copyright`,
                cy: `Hawlfraint`,
              })}{' '}
              {`${new Date().getFullYear()} Money & Pensions Service, Borough Hall, Cauldwell Street, Bedford, MK42 9AB.`}
            </Paragraph>
            <Paragraph className="text-white">
              {z({
                en: 'All rights reserved.',
                cy: 'Cedwir pob hawl',
              })}
            </Paragraph>
          </div>
        </Container>
      </div>
    </footer>
  );
};
