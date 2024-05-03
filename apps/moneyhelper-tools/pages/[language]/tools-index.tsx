import {
  Container,
  Heading,
  Link,
  Paragraph,
  ToolPageLayout,
} from '@maps-digital/shared/ui';
import { Tool } from '../../components/Tool';
import { NextPage } from 'next';

const Page: NextPage = () => {
  const tools = [
    {
      title: 'Credit Rejection',
      name: 'credit-rejection',
      description: 'Credit rejection',
      embedV2: true,
    },
    {
      title: 'Workplace Pension Contribution Calculator',
      name: 'workplace-pension-calculator',
      description: 'Workplace pension contribution calculator',
      embedV2: true,
    },
  ];

  return (
    <ToolPageLayout>
      <Container>
        <div className="space-y-8">
          <Heading level="h1" className="text-blue-800">
            MoneyHelper Tools
          </Heading>
          <div className="border p-3">
            <div className="mt-3 mb-3">
              <Paragraph className="text-lg">
                This page contains all our embeddable tools that you can use on
                your own website.
              </Paragraph>
            </div>
            <ul className="list-disc ml-6">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link href={`#${tool.name}`}>{tool.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          {tools.map(({ ...props }) => (
            <Tool key={props.name} {...props} />
          ))}
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export default Page;
