import Image from 'next/image';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useContextLanguage } from '@maps-react/hooks/useLanguage';
import useTranslation from '@maps-react/hooks/useTranslation';

export const HeadingSection = () => {
  const lang = useContextLanguage();
  const { z } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-tan-400 p-4 pb-12 md:p-10">
      {/* Left Column Content */}
      <div className="flex-1 space-y-4">
        <H1 className="text-blue-700 mb-8">
          {z({
            en: 'Pension calculator',
            cy: '',
          })}
        </H1>
        <Paragraph className="text-blue-700 mb-8 max-w-[600px]">
          {z({
            en: 'Find out how much retirement income your pensions could give you and how much you might need.',
            cy: '',
          })}
        </Paragraph>

        {/* Mobile-only Image position (swaps out or sits above/below the link) */}
        <div className="md:hidden my-4">
          <Image
            src="/homepage/heading-banner.png"
            alt="Pension calculator banner"
            width={400}
            height={300}
            className="w-full h-auto border-none"
          />
        </div>

        <div className="!mt-8 !mb-6 hidden md:block">
          <Link
            type="anchor"
            href="#how-it-works"
            className="text-magenta-500"
            data-testid="how-it-works-link"
          >
            {z({
              en: 'How the calculator below works',
              cy: '',
            })}
          </Link>
        </div>
        <div>
          <Button
            as="a"
            href={`${lang}/about-you`}
            className="mb-8 w-full md:w-auto"
            data-testid="start-pension-calculator-hero"
          >
            {z({
              en: 'Start the Pension calculator',
              cy: '',
            })}
          </Button>
        </div>
        <div className="flex flex-row items-center gap-2 text-blue-700 font-bold">
          <Icon type={IconType.CLOCK} className="max-w-6" />
          <Paragraph className="m-0" data-testid="time-estimate">
            {z({
              en: '20 minutes average completion time',
              cy: '',
            })}
          </Paragraph>
        </div>
        <Paragraph className="text-blue-700 ml-8 font-bold hidden md:block">
          {z({
            en: 'Save and return at any time',
            cy: '',
          })}
        </Paragraph>
      </div>

      {/* Desktop-only Image position on the right */}
      <div className="hidden md:block flex-shrink-0 w-1/3">
        <Image
          src="/homepage/heading-banner.png"
          alt="Pension calculator banner"
          width={400}
          height={300}
          className="w-full h-auto rounded-lg"
          priority
        />
      </div>
    </div>
  );
};
