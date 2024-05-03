import { ReactNode, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { StepContainer } from 'components/StepContainer';
import { Paragraph, Link, H1, Button } from '@maps-digital/shared/ui';
import { useTranslation } from '@maps-digital/shared/hooks';

type Props = {
  heading: string;
  mainContent: ReactNode;
  backLink: string;
  firstStep?: string;
  intro?: string;
  extraContent?: ReactNode;
  mainContentContainerClass?: string;
  mainContentClass?: string;
  displayActionButtons?: boolean;
};

export const Results = ({
  heading,
  mainContent,
  backLink,
  firstStep,
  intro,
  extraContent,
  mainContentContainerClass,
  mainContentClass,
  displayActionButtons = true,
}: Props) => {
  const { z } = useTranslation();
  const [displayCopyUrl, setDisplayCopyUrl] = useState(false);

  useEffect(() => {
    setDisplayCopyUrl(true);
  }, [displayCopyUrl]);

  return (
    <StepContainer backLink={backLink}>
      <div className="mt-8">
        <H1 data-testid={`results-page-heading`} className="max-w-[840px]">
          {heading}
        </H1>
        {intro && (
          <Paragraph
            className={`max-w-[840px] mb-8`}
            data-testid={'results-intro'}
          >
            {intro}
          </Paragraph>
        )}
        <div className="flex flex-col-reverse sm:flex-col">
          {displayActionButtons && (
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              {displayCopyUrl ? (
                <Button
                  variant="primary"
                  onClick={(e) => copy(window.location.href)}
                  data-testid={'copy-link'}
                >
                  {z({
                    en: 'Copy your custom action plan link',
                    cy: 'Copiwch ddolen eich cynllun gweithredu personol',
                  })}
                </Button>
              ) : (
                <div>
                  To print the page press cmd and <br /> P in your keyboard
                </div>
              )}

              {firstStep && (
                <Link asButtonVariant="secondary" href={firstStep}>
                  <span
                    className="block w-full text-center"
                    data-testid={'start-again-link'}
                  >
                    {z({ en: 'Start again', cy: 'Dechrau eto' })}
                  </span>
                </Link>
              )}
            </div>
          )}

          <div
            className={`${
              mainContentContainerClass ?? 'border-slate-400 max-w-[840px] mb-8'
            }`}
          >
            <div className={`${mainContentClass ?? 'pt-8 pb-8'}`}>
              {mainContent}
            </div>
          </div>
        </div>
        {extraContent && (
          <div className={'max-w-[840}px] mb-8'}>{extraContent}</div>
        )}
      </div>
    </StepContainer>
  );
};
