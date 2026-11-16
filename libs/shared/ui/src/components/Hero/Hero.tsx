import { ReactNode } from 'react';

import { H1 } from '../Heading';
import { Icon, IconType } from '../Icon';

export type HeroProps = {
  children: ReactNode;
  testId?: string;
  title: string;
};

export const Hero = ({
  children,
  testId = 'hero-banner',
  title,
  ...props
}: HeroProps) => {
  return (
    <div data-testid={testId} {...props} className="mb-16 bg-blue-700">
      <div className="container-auto relative py-6 h-full w-full lg:p-20 lg:block bg-no-repeat bg:none bg-[right_center] bg-[size:420px] lg:bg-hero_pension_wise">
        <div className="absolute left-9 top-9">
          <Icon
            type={IconType.ARROW_BRAND_CURVED}
            className="hidden lg:block md:scale-[1.82]"
          />
        </div>
        <div className="hero">
          <div className="text-2xl font-semibold text-white lg:ml-8 lg:w-7/12 xl:w-3/4 xl:pr-32">
            <H1 data-testid="hero-title" color="md:text-6xl mb-8">
              {title}
            </H1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
