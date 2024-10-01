import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ProgressBar } from '@maps-react/common/components/ProgressBar';
import { Carousel } from '@maps-react/common/components/Carousel';
import { useCarouselAutoPlay } from '@maps-react/hooks/useCarousel';
import { CarouselProps } from '@maps-react/hooks/types';
import { InformationCallout } from '@maps-react/common/components/InformationCallout';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

type LoaderProps = {
  duration: number;
};

export const Loader = ({ duration = 100 }: LoaderProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [jsEnabled, setJsEnabled] = useState(false);
  const router = useRouter();
  const redirectUrl = '/en/overview';

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
  }, [timeLeft, router]);

  const progressPercent = Math.round(((duration - timeLeft) / duration) * 100);

  const carouselItems = [
    {
      image: {
        src: '/carousel/piggy-bank-logo.png',
        height: 102,
        width: 82,
        alt: 'Logo of a piggy bank',
      },
      text: 'There are an estimated 2.8 million pension pots not currently matched to their owner',
    },
    {
      image: {
        src: '/carousel/dashboard-screen-logo.png',
        height: 85,
        width: 101,
        alt: 'Logo of a dashboard screen',
      },
      text: 'Not all pension options are listed here. Please get in touch with your specific schemes and providers for more details.',
    },
    {
      image: {
        src: '/carousel/three-arrows-logo.png',
        height: 117,
        width: 95,
        alt: 'Logo of three arrows fanning out',
      },
      text: 'Not all pension options are listed here. Please get in touch with your specific schemes and providers for more details.',
    },
  ];

  const carouselOptions: CarouselProps['options'] = {
    loop: false,
    watchDrag: false,
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
      {timeLeft > 0 && (
        <div data-testid="intro-text">
          <p className="text-2xl text-center">
            This typically takes {duration} seconds. Thank you for your
            patience.
          </p>
          <p className="text-2xl text-center">
            We&apos;re searching 3000 pension schemes and providers for your
            pensions.
          </p>
        </div>
      )}

      {jsEnabled && (
        <>
          <p className="text-center font-bold mt-8">
            Do not refresh or close the page.
          </p>

          <div className={'max-w-[460px] mx-auto mb-20 mt-10 block'}>
            <ProgressBar
              label={`${progressPercent}% complete`}
              value={progressPercent}
              max={100}
            />
          </div>

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
            <div data-testid="lower-text" className="my-10">
              <Carousel options={carouselOptions} plugins={carouselPlugins}>
                {carouselItems.map((item, index) => (
                  <InformationCallout
                    key={`card-${index}`}
                    className="max-w-[718px] mx-auto flex content-between bg-blue-100 pr-10 border-none"
                  >
                    <div className="min-w-[162px] flex justify-center">
                      <Image
                        className="my-auto"
                        src={item.image.src}
                        width={item.image.width}
                        height={item.image.height}
                        alt={item.image.alt}
                      />
                    </div>
                    <div className="py-10">
                      <Heading level="h4">Did you know?</Heading>
                      <Paragraph className="mb-0">{item.text}</Paragraph>
                    </div>
                  </InformationCallout>
                ))}
              </Carousel>
            </div>
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
            <p className="text-center font-bold mb-12">
              Do not refresh or close the page.
            </p>
            <InformationCallout
              className="max-w-[718px] mx-auto flex flex-col bg-blue-100 p-10 border-none"
              data-testid="nonjs-information-cards"
            >
              <Heading level="h3" className="mb-8">
                Did you know?
              </Heading>
              {carouselItems.map((item, index) => (
                <div
                  className="flex flex-row items-center"
                  key={`card-${index}`}
                >
                  <div className="min-w-[162px] justify-center">
                    <Image
                      className="my-auto"
                      src={item.image.src}
                      width={item.image.width}
                      height={item.image.height}
                      alt={item.image.alt}
                    />
                  </div>
                  <div className="py-10">
                    <Paragraph className="mb-0">{item.text}</Paragraph>
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
