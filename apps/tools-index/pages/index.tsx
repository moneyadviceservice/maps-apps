import { NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

import { Tool } from '../components/Tool';
import { tools } from '../data/tools-index-data';

const Page: NextPage = () => {
  const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

  // Filter out tools where live = false in production
  const filteredTools = isProduction
    ? tools.filter((tool) => tool.live !== false)
    : tools;

  // Sort tools alphabetically by title (case-insensitive)
  const sortedTools = [...filteredTools].sort((a, b) =>
    a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
  );

  return (
    <ToolPageLayout pageTitle="Tools Index - MoneyHelper">
      <Container>
        <div className="space-y-8 t-cls-heading">
          <Heading level="h1" className="text-blue-700">
            MoneyHelper Tools
          </Heading>
          <div className="p-3 border">
            <div className="mt-3 mb-3">
              <Paragraph className="text-lg">
                This page contains all our embeddable tools that you can use on
                your own website.
              </Paragraph>
            </div>
            <ul className="ml-6 list-disc">
              {sortedTools.map((tool) => (
                <li key={tool.path}>
                  <Link
                    href={`#${tool.title.replace(/ /g, '')}`}
                    className="text-lg"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {sortedTools.map(({ ...props }) => (
            <Tool key={props.path} {...props} />
          ))}
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;
