import { CalloutSection } from 'components/landing/CalloutSection';
import { HeadingSection } from 'components/landing/HeadingSection';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

const LandingPage = () => {
  const lang = useContextLanguage();
  const { z } = useTranslation();

  return (
    <PensionCalculatorBase pageHeading="Pension Calculator" showHeading={false}>
      <>
        <HeadingSection />
        <div className={twMerge('lg:max-w-[840px] space-y-4')}>
          <section>
            <H2 className="text-blue-700">
              {z({
                en: "What you'll get",
                cy: '',
              })}
            </H2>
            <Paragraph>
              {z({
                en: 'This tool will show you:',
                cy: '',
              })}
            </Paragraph>
            {z({
              en: (
                <ListElement
                  variant="unordered"
                  items={[
                    "an estimate of all the pension income you'll get when you'd like to retire, including the State Pension",
                    'an estimate of the target retirement income you might need',
                    {
                      content:
                        'how your estimated pension income might change if you:',
                      sublist: {
                        variant: 'unordered',
                        items: [
                          'increase how much is paid in',
                          'take your pension earlier or later',
                          'take a tax-free lump sum upfront.',
                        ],
                      },
                    },
                  ]}
                  color="blue"
                  className="pb-8 pl-10 pr-8 list-inside"
                />
              ),
              cy: (
                <ListElement
                  variant="unordered"
                  items={[
                    '',
                    '',
                    {
                      content: '',
                      sublist: {
                        variant: 'unordered',
                        items: ['', '', ''],
                      },
                    },
                  ]}
                  color="blue"
                  className="pb-8 pl-10 pr-8 list-inside"
                />
              ),
            })}
          </section>
          <section>
            <H2 className="text-blue-700">How it works</H2>
            <Paragraph>
              {z({
                en: "We'll ask you for details of your finances and future plans, including:",
                cy: '',
              })}
            </Paragraph>
            {z({
              en: (
                <ListElement
                  variant="unordered"
                  items={[
                    'your age and salary',
                    "the age you'd like to retire",
                    'how much any defined contribution pensions are currently worth',
                    'how much any defined benefit pensions are on track to pay.',
                  ]}
                  color="blue"
                  className="pb-8 pl-10 pr-8 list-inside"
                />
              ),
              cy: (
                <ListElement
                  variant="unordered"
                  items={['', '', '', '']}
                  color="blue"
                  className="pb-8 pl-10 pr-8 list-inside"
                />
              ),
            })}

            <Paragraph>
              {z({
                en: "We'll calculate your target retirement income based on your salary, but you can change this if you already have a figure in mind.",
                cy: '',
              })}
            </Paragraph>
          </section>
          <section>
            <H2 className="text-blue-700">
              {z({
                en: "What you'll need",
                cy: '',
              })}
            </H2>
            <Paragraph>
              {z({
                en: "To get the most accurate results, it's best to:",
                cy: '',
              })}
            </Paragraph>
            {z({
              en: (
                <ListElement
                  variant="unordered"
                  items={[
                    'know the type of pensions you have - our tool helps you find out your pension type or you can ask your pension provider',
                    "know how much any private pensions are estimated to pay you - you can usually log in to your provider's online account or use your last annual statement",
                    'create a budget to work out how much retirement income you might need - our Budget planner can help you do this.',
                  ]}
                  color="blue"
                  className="pb-8 pl-10 pr-8 list-inside"
                />
              ),
              cy: (
                <ListElement
                  variant="unordered"
                  items={['', '', '']}
                  color="blue"
                  className="pb-8 pl-10 pr-8 list-inside"
                />
              ),
            })}

            <Paragraph>
              {z({
                en: "We'll show you the current maximum State Pension amount you could get. To see how much you're on track to get, you can check your State Pension forecast on GOV.UK.",
                cy: '',
              })}
            </Paragraph>
          </section>
          <section>
            <Button
              as="a"
              href={`https://www.moneyhelper.org.uk/${lang}/pensions-and-retirement/taking-your-pension/checklist-things-to-do-as-retirement-approaches`}
              className="my-4"
            >
              {z({
                en: 'Start my retirement budget',
                cy: '',
              })}
            </Button>
          </section>
          <CalloutSection />
        </div>
      </>
    </PensionCalculatorBase>
  );
};

export default LandingPage;
