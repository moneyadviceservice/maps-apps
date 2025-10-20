import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Carousel } from '@maps-react/common/components/Carousel';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import {
  ProgressBar,
  VariantType,
} from '@maps-react/common/components/ProgressBar';
import { CarouselProps } from '@maps-react/hooks/types';
import { useCarouselAutoPlay } from '@maps-react/hooks/useCarousel';
import { Markdown } from '@maps-react/vendor/components/Markdown';

type LoaderProps = {
  duration: number;
  durationLeft: number;
  description: string;
  refreshText: string;
  carouselHeading: string;
  progressComplete: string;
  redirectUrl: string;
  carouselItems: {
    text: string;
    subText?: string;
  }[];
};

export const Loader = ({
  duration,
  durationLeft,
  description,
  refreshText,
  progressComplete,
  redirectUrl,
  carouselHeading,
  carouselItems,
}: LoaderProps) => {
  const [timeLeft, setTimeLeft] = useState(durationLeft);
  const [jsEnabled, setJsEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, 2000);

      return () => clearTimeout(timer);
    }
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, router, redirectUrl]);

  const progressPercent = Math.round(((duration - timeLeft) / duration) * 100);

  const carouselOptions: CarouselProps['options'] = {
    loop: false,
    watchDrag: false,
    active: false,
    breakpoints: {
      '(min-width: 768px)': { active: true },
    },
  };

  const carouselPlugins: CarouselProps['plugins'] = [
    useCarouselAutoPlay({
      autoPlayOptions: {
        delay: (duration * 1000) / carouselItems.length,
        stopOnInteraction: false,
        stopOnFocusIn: false,
        stopOnLastSnap: true,
      },
    }),
  ];

  return (
    <div data-testid="loader">
      {jsEnabled ? (
        <>
          <div
            className={'max-w-[500px] mx-auto mt-9 md:mt-10 mb-6 md:mb-4 block'}
          >
            <ProgressBar
              label={`${progressPercent}% ${progressComplete}${
                progressPercent === 100 ? '' : '...'
              }`}
              value={progressPercent}
              max={100}
              variant={VariantType.BLUE}
            />
          </div>

          {timeLeft <= 0 ? (
            <div
              data-testid="success"
              className="w-[80px] h-[80px] md:w-[136px] md:h-[136px] flex align-middle mx-auto rounded-full border-[5px] md:border-8 border-green-600 mt-8"
            >
              <Icon
                type={IconType.TICK}
                className="w-[44px] h-[44px] md:w-[90px] md:h-[90px] m-auto fill-green-600"
              />
            </div>
          ) : (
            <>
              <Markdown
                data-testid="intro-text"
                className="mb-6 text-2xl text-center md:mb-8"
                content={description}
              />
              <p className="text-base font-bold text-center">{refreshText}</p>
              <div
                data-testid="lower-text"
                className="hidden my-10 lg:grid lg:grid-cols-12"
              >
                <div className="col-span-10 col-start-2 lg:mt-7">
                  <Carousel options={carouselOptions} plugins={carouselPlugins}>
                    {carouselItems.map((item, index) => (
                      <InformationCallout
                        key={`card-${index}`}
                        className="pb-10 text-center border-none bg-yellow-180"
                      >
                        <div className="[background-position:center_20px] bg-no-repeat bg-[url('/images/loader-clouds.webp')]">
                          <div className="pt-6 pb-2">
                            <Heading
                              component="h2"
                              level="h3"
                              variant="secondary"
                            >
                              {carouselHeading}
                            </Heading>
                            <Paragraph className="mt-4 mb-2">
                              {item.text}
                            </Paragraph>
                            {item.subText && (
                              <p className="mb-0 text-base leading-7 text-gray-650">
                                {item.subText}
                              </p>
                            )}
                          </div>
                          <Image
                            src="/images/benefits-calculator.svg"
                            width={300}
                            height={186}
                            alt=""
                            className="mx-auto"
                          />
                        </div>
                      </InformationCallout>
                    ))}
                  </Carousel>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="mt-6 md:my-10">
            <Icon
              type={IconType.SPINNER_MHPD}
              className="w-[80px] h-[80px] animate-spin mx-auto mb-6 text-blue-700"
              data-testid="nonjs-spinner"
            />
            <Markdown
              data-testid="intro-text"
              className="mb-6 text-base text-center md:text-2xl md:mb-8"
              content={description}
            />
            <p className="text-base font-bold text-center">{refreshText}</p>
            <div className="hidden mt-16 mb-10 lg:grid lg:grid-cols-12">
              <div className="col-span-10 col-start-2">
                <InformationCallout
                  className="pt-6 pb-10 text-center border-none bg-yellow-180"
                  data-testid="nonjs-information-cards"
                >
                  <div className="[background-position:center_-20px] bg-no-repeat bg-[url('/images/loader-clouds-no-js.webp')]">
                    <Heading component="h2" level="h3" variant="secondary">
                      {carouselHeading}
                    </Heading>
                    {carouselItems.map((item, index) => (
                      <div key={`card-${index}`}>
                        <div className="pt-4 pb-4">
                          <Paragraph className="mb-2">{item.text}</Paragraph>
                          {item.subText && (
                            <p className="mb-0 text-base leading-7 text-gray-650">
                              {item.subText}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    <Image
                      src="/images/benefits-calculator.svg"
                      width={300}
                      height={186}
                      alt=""
                      className="mx-auto"
                    />
                  </div>
                </InformationCallout>
              </div>
            </div>
          </div>
          <noscript data-testid="noscript-refresh">
            <meta
              httpEquiv="refresh"
              content={`${duration};url=${redirectUrl}`}
            />
          </noscript>
        </>
      )}
    </div>
  );
};
