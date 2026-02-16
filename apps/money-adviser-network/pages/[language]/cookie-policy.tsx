import { GetServerSideProps } from 'next';

import { cookiePolicyData } from 'data/cookie-policy';
import { twMerge } from 'tailwind-merge';
import { getPageTitle } from 'utils/getPageTitle';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ToolIntro } from '@maps-react/common/components/ToolIntro';
import { Container } from '@maps-react/core/components/Container';
import useTranslation from '@maps-react/hooks/useTranslation';

import { MoneyAdviserNetwork } from '.';

type Props = {
  referer?: string;
};

export default function CookiePolicyPage({ referer }: Readonly<Props>) {
  const { z } = useTranslation();

  const { title, intro, guide, content } = cookiePolicyData(z);

  const backHref = referer || '/';

  const pageTitle = getPageTitle('cookiePolicy', z);

  return (
    <MoneyAdviserNetwork step="cookiePolicy">
      <Container className="pb-16">
        <div className={twMerge('lg:max-w-[840px] space-y-8')}>
          <BackLink
            href={backHref}
            className="text-sm underline mb-6 inline-block"
          >
            Back
          </BackLink>

          <div>
            <Heading level="h1" className="mb-0">
              {pageTitle}
            </Heading>
            <Heading level="h2" className="pt-0">
              {title}
            </Heading>
          </div>

          <ToolIntro>{intro.paragraph}</ToolIntro>

          {/* What's in this guide */}
          <section className="mt-10">
            <Heading level="h3" className="mb-4">
              {guide.title}
            </Heading>

            <ul className="t-link-list">
              {guide.sections.map((item) => (
                <li
                  key={item.anchor}
                  className="border-b first:border-t border-slate-400"
                >
                  <Link
                    href={`#${item.anchor}`}
                    className="block py-2 no-underline text-magenta-500 visited:text-magenta-500"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Content sections */}
          {content.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="mt-12 scroll-mt-24"
            >
              <Heading level="h3" className="mb-3">
                {section.heading}
              </Heading>

              {section.paragraphs?.map((p, idx) => (
                <Paragraph key={idx}>{p}</Paragraph>
              ))}

              {section.table && (
                <div className="mt-6 overflow-x-auto">
                  <Paragraph>{section.table.caption}</Paragraph>
                  <table className="min-w-full border border-gray-200 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        {section.table.headers.map((h) => (
                          <th
                            key={h}
                            className="border px-3 py-2 text-left font-semibold"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, i) => {
                        const isGroupRow = row[1] === '' && row[2] === '';
                        return (
                          <tr
                            key={i}
                            className={isGroupRow ? 'font-semibold' : ''}
                          >
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className={`border px-3 py-2 ${
                                  isGroupRow && j === 0 ? 'font-semibold' : ''
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>
      </Container>
    </MoneyAdviserNetwork>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const referer = context.req.headers.referer;
  const host = context.req.headers.host;
  const isInternal = referer && host && referer.includes(host);

  return { props: { referer: isInternal ? referer : '/' } };
};
