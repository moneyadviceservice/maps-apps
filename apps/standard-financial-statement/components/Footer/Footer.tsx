import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
import { ImageType, LinkType } from 'types/@adobe/components';

import { Link } from '@maps-react/common/components/Link';
import { Container } from '@maps-react/core/components/Container';
import useLanguage from '@maps-react/hooks/useLanguage';

export const Footer = ({
  assetPath,
  footerPath,
  footerLogo,
  footerLinks,
}: {
  assetPath: string;
  footerPath: string;
  footerLogo: { image: ImageType; altText: string };
  footerLinks: LinkType[];
}) => {
  const language = useLanguage();

  return (
    <footer data-testid="footer" className={twMerge(' relative z-1')}>
      <div className="flex flex-col py-8 bg-gray-500 md:flex-row md:py-6">
        <Container className="flex flex-col text-white md:flex-row max-w-[1272px]">
          {footerPath && (
            <Image
              src={`${assetPath}${footerPath}`}
              width="167"
              height="53"
              alt={footerLogo?.altText}
            />
          )}
          <ul className="relative flex flex-row flex-wrap mt-8 md:ml-auto md:mt-0">
            {footerLinks?.map((i, index) => {
              return (
                <li
                  key={i.text}
                  className={twMerge(
                    'text-white last:mr-0 relative px-2.5 sm:px-4 first:pl-0 flex items-center',
                  )}
                >
                  <Link
                    className={twMerge(
                      'text-sm text-gray-100 visited:text-gray-100 after:content-[""] after:absolute after:h-[16px] after:w-[1px] after:bg-blue-300 after:-m-[8px] after:top-[50%] after:right-[8px] hover:text-green-300 hover:underline',
                      footerLinks.length - 1 === index ? 'after:hidden' : '',
                    )}
                    href={`/${language}${i.linkTo}`}
                  >
                    {i.text}
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>
    </footer>
  );
};
