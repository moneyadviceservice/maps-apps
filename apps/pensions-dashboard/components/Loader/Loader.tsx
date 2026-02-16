import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import {
  ProgressBar,
  VariantType,
} from '@maps-react/common/components/ProgressBar';
import { Markdown } from '@maps-react/vendor/components/Markdown';

import { useLoadingProgress } from '../../lib/hooks';

type LoaderProps = {
  duration: number;
  durationLeft: number;
  description: string;
  refreshText: string;
  progressComplete: string;
  redirectUrl: string;
};

export const Loader = ({
  duration,
  durationLeft,
  description,
  refreshText,
  progressComplete,
  redirectUrl,
}: LoaderProps) => {
  const [jsEnabled, setJsEnabled] = useState(false);
  const router = useRouter();

  const { timeLeft, progressPercent, progressLabel, announcementText } =
    useLoadingProgress({
      duration,
      durationLeft,
      progressComplete,
      onComplete: () => {
        router.push(redirectUrl);
      },
    });

  useEffect(() => {
    setJsEnabled(true);
  }, []);

  return (
    <div data-testid="loader">
      <output
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        data-testid="progress-announcer"
      >
        {announcementText}
      </output>
      {jsEnabled ? (
        <>
          <div
            className={'max-w-[500px] mx-auto mt-9 md:mt-10 mb-6 md:mb-4 block'}
          >
            <ProgressBar
              label={progressLabel}
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
