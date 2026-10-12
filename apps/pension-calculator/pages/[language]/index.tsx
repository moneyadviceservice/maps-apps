import { CalloutSection } from 'components/landing/CalloutSection';
import { HeadingSection } from 'components/landing/HeadingSection';
import { PensionCalculatorBase } from 'layouts/PensionCalculatorBase';
import { twMerge } from 'tailwind-merge';

import { Breadcrumb } from '@maps-react/common/components/Breadcrumb/Breadcrumb';
import { Button } from '@maps-react/common/components/Button';
import { H2 } from '@maps-react/common/components/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

export const fullScreenMobileClasses = 'ml-[-16px] mr-[-16px] md:ml-0 md:mr-0';

const FullScreenMobileContainer = ({
  classes,
  children,
}: {
  classes?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={twMerge('my-0', fullScreenMobileClasses, classes)}>
      {children}
    </div>
  );
};

const LandingPage = () => {
  const lang = useContextLanguage();
  const { z } = useTranslation();

  return (
    <PensionCalculatorBase pageHeading="Pension Calculator" showHeading={false}>
      <>
        <FullScreenMobileContainer classes={'my-0'}>
          <Breadcrumb
            crumbs={[
              { label: 'Home', link: 'https://www.moneyhelper.org.uk' },
              {
                label: 'Pensions & Retirement',
                link: 'https://www.moneyhelper.org.uk/en/pensions-and-retirement',
              },
              { label: 'pension-calculator', link: `/${lang}/` },
            ]}
          />
        </FullScreenMobileContainer>
        <FullScreenMobileContainer classes={'!mt-0'}>
          <HeadingSection />
        </FullScreenMobileContainer>
        <div className={twMerge('lg:max-w-[840px] space-y-4')}>
          <section id="what-youll-get" data-testid="what-youll-get-section">
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
                        className: 'list-disc',
                        items: [
                          'increase how much is paid in',
                          'take your pension earlier or later',
                          'take a tax-free lump sum upfront.',
                        ],
                      },
                    },
                  ]}
                  color="blue"
                  className="pb-8 pl-4 pr-8 list-inside"
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
                        className: 'list-disc',
                        items: ['', '', ''],
                      },
                    },
                  ]}
                  color="blue"
                  className="pb-8 pl-4 pr-8 list-inside"
                />
              ),
            })}
          </section>
          <section id="how-it-works" data-testid="how-it-works-section">
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
                    'your current age and salary',
                    "the age you'd like to retire",
                    "if you have a defined contribution pension - or another type that builds up a pot of money - and how much it's currently worth",
                    "if you have a defined benefit pension - or another type that will automatically provide a regular income - and how much it's on track to pay.",
                  ]}
                  color="blue"
                  className="pb-8 pl-4 pr-8 list-inside"
                />
              ),
              cy: (
                <ListElement
                  variant="unordered"
                  items={['', '', '', '']}
                  color="blue"
                  className="pb-8 pl-4 pr-8 list-inside"
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
          <section id="what-youll-need" data-testid="what-youll-need-section">
            <H2 className="text-blue-700">
              {z({
                en: "What you'll need",
                cy: '',
              })}
            </H2>
            <Paragraph>
              {z({
                en: "To get the most accurate results, it's best to know how much any private pensions are estimated to pay you.",
                cy: '',
              })}
            </Paragraph>

            <Paragraph>
              {z({
                en: "You can usually log in to your provider's online account or use your last annual statement.",
                cy: '',
              })}
            </Paragraph>
          </section>
          <section id="start-calculator" data-testid="start-calculator-section">
            <Button
              as="a"
              href={`${lang}/about-you`}
              className="my-4"
              data-testid="start-pension-calculator-footer"
            >
              {z({
                en: 'Start the Pension calculator',
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
