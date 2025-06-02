import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { Carousel } from '@maps-react/common/components/Carousel';
import { Heading } from '@maps-react/common/components/Heading';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ProgressBar } from '@maps-react/common/components/ProgressBar';
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
    image: {
      src: string;
      width: number;
      height: number;
      alt: string;
    };
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
      {jsEnabled && (
        <div
          className={'max-w-[460px] mx-auto mt-6 md:mt-10 mb-6 md:mb-11 block'}
        >
          <ProgressBar
            label={`${progressPercent}% ${progressComplete}`}
            value={progressPercent}
            max={100}
          />
        </div>
      )}

      {jsEnabled && (
        <>
          {timeLeft <= 0 ? (
            <div
              data-testid="success"
              className="w-[136px] h-[136px] flex align-middle mx-auto rounded-full border-8 border-green-700 mt-20"
            >
              <Icon
                type={IconType.TICK_GREEN}
                className="w-[90px] h-[90px] m-auto"
              />
            </div>
          ) : (
            <>
              <Markdown
                data-testid="intro-text"
                className="mb-6 text-2xl text-center md:mb-11"
                content={description}
              />
              <p className="text-2xl font-bold text-center">{refreshText}</p>
              <div data-testid="lower-text" className="hidden my-10 md:block">
                <Carousel options={carouselOptions} plugins={carouselPlugins}>
                  {carouselItems.map((item, index) => (
                    <InformationCallout
                      key={`card-${index}`}
                      className="max-w-[718px] mx-auto flex content-between bg-blue-100 pr-20 border-none"
                    >
                      <div className="min-w-[128px] pt-8">
                        <Image
                          src={item.image.src}
                          width={item.image.width}
                          height={item.image.height}
                          alt={item.image.alt}
                          className="mx-auto"
                        />
                      </div>
                      <div className="py-6">
                        <Heading level="h4">{carouselHeading}</Heading>
                        <Paragraph className="mb-1">{item.text}</Paragraph>
                        {item.subText && (
                          <p className="mb-0 text-sm leading-7 text-gray-400">
                            {item.subText}
                          </p>
                        )}
                      </div>
                    </InformationCallout>
                  ))}
                </Carousel>
              </div>
            </>
          )}
        </>
      )}

      {!jsEnabled && (
        <>
          <div className="my-10">
            <Icon
              type={IconType.SPINNER}
              className="w-[90px] h-[90px] animate-spin mx-auto my-10 text-blue-800"
              data-testid="nonjs-spinner"
            />
            <p className="mb-12 text-2xl font-bold text-center">
              {refreshText}
            </p>
            <Markdown
              data-testid="intro-text"
              className="mb-6 text-2xl text-center md:mb-16"
              content={description}
            />
            <InformationCallout
              className="max-w-[718px] mx-auto flex flex-col bg-blue-100 pl-10 py-6 pr-20 border-none"
              data-testid="nonjs-information-cards"
            >
              <Heading level="h3" className="mb-2 md:text-4xl">
                {carouselHeading}
              </Heading>
              {carouselItems.map((item, index) => (
                <div
                  className="flex flex-row content-between"
                  key={`card-${index}`}
                >
                  <div className="min-w-[84px] pt-8">
                    <Image
                      src={item.image.src}
                      width={item.image.width}
                      height={item.image.height}
                      alt={item.image.alt}
                      className="mx-auto"
                    />
                  </div>
                  <div className="pt-6 pb-2">
                    <Paragraph className="mb-0">{item.text}</Paragraph>
                    {item.subText && (
                      <p className="mb-0 text-sm leading-7 text-gray-400">
                        {item.subText}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </InformationCallout>
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
