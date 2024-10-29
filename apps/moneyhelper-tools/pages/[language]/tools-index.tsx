import { Heading, Link, Paragraph } from '@maps-digital/shared/ui';
import { Container } from '@maps-react/core/components/Container';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';
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
      title: 'Pension Type',
      name: 'pension-type',
      description: 'Pension Type',
      embedV2: true,
    },
    {
      title: 'Workplace Pension Contribution Calculator',
      name: 'workplace-pension-calculator',
      description: 'Workplace pension contribution calculator',
      embedV2: true,
    },
    {
      title: 'Cash In Chunks Calculator',
      name: 'cic-calculator',
      description: 'Cash In Chunks Calculator',
    },
    {
      title: 'Take Whole Pot',
      name: 'take-whole-pot-calculator',
      description: 'Take Whole Pot',
    },
    {
      title: 'Guaranteed Retirement Income',
      name: 'guaranteed-income-estimator',
      description: 'Guaranteed Income Estimator',
    },
    {
      title: 'Leave Pot Untouched',
      name: 'leave-pot-untouched',
      description: 'Leave Pot Untouched',
    },
    {
      title: 'Adjustable Income Estimator',
      name: 'adjustable-income-estimator',
      description: 'Adjustable Income Estimator',
    },
    {
      title: 'Savings Calculator',
      name: 'savings-calculator',
      description: 'Savings Calculator',
    },
    {
      title: 'Baby Costs Calculator',
      name: 'baby-cost-calculator',
      description: 'Baby Costs Calculator',
    },
    {
      title: 'Mortgage Affordability Calculator',
      name: 'mortgage-affordability-calculator',
      description: 'Mortgage Affordability Calculator',
    },
    {
      title: 'Baby Money Timeline',
      name: 'baby-money-timeline',
      description: 'Baby Money Timeline',
    },
  ];

  return (
    <ToolPageLayout>
      <Container>
        <div className="space-y-8">
          <Heading level="h1" className="text-blue-800">
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
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link href={`#${tool.name}`} className="text-lg">
                    {tool.title}
                  </Link>
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
