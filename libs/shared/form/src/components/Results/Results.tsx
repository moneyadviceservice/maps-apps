import { ReactNode, useEffect, useRef, useState } from 'react';

import copy from 'copy-to-clipboard';
import { twMerge } from 'tailwind-merge';

import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { TranslationGroupString } from '../../types';
import {
  GridStepContainer,
  Layout,
} from '../GridStepContainer/GridStepContainer';
import { StepContainer } from '../StepContainer';

type Props = {
  heading: string;
  mainContent: ReactNode;
  backLink: string;
  firstStep?: string;
  intro?: string | ReactNode;
  extraContent?: ReactNode;
  mainContentContainerClass?: string;
  mainContentClass?: string;
  displayActionButtons?: boolean;
  removeEmbedFromUrl?: boolean;
  copyUrlText?: TranslationGroupString;
  layout?: Layout;
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
  removeEmbedFromUrl = true,
  copyUrlText,
  layout = 'default',
}: Props) => {
  const { z } = useTranslation();
  const [displayCopyUrl, setDisplayCopyUrl] = useState(false);
  const copyButtonRef = useRef<HTMLParagraphElement>(null);

  const [copyButtonText, setCopyButtonText] = useState<
    TranslationGroupString | undefined
  >(copyUrlText);

  const handleCopyButtonText = () => {
    setCopyButtonText({
      en: 'Link copied!',
      cy: `Dolen wedi'i chopïo!`,
    });

    const timeout = setTimeout(() => {
      setCopyButtonText(copyUrlText);
    }, 3000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    if (copyButtonRef.current) {
      copyButtonRef.current.focus();
    }
  }, [copyButtonText]);

  useEffect(() => {
    setDisplayCopyUrl(true);
  }, [displayCopyUrl]);

  const Container = layout === 'grid' ? GridStepContainer : StepContainer;

  return (
    <Container backLink={backLink}>
      <div className="mt-8 md:mb-8">
        <H1
          data-testid={`results-page-heading`}
          id={`results-page-heading`}
          className={twMerge(intro === undefined ? 'mb-0 sm:mb-6 lg:mb-8' : '')}
        >
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
            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
              {displayCopyUrl && copyUrlText ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    if (removeEmbedFromUrl) {
                      const url = new URL(globalThis.location.href);
                      const params = new URLSearchParams(url.search);
                      params.delete('isEmbedded');
                      url.search = params.toString();
                      copy(url.toString());
                    } else {
                      copy(globalThis.location.href);
                    }
                    handleCopyButtonText();
                  }}
                  data-testid={'copy-link'}
                >
                  {copyButtonText && z(copyButtonText)}
                </Button>
              ) : (
                copyUrlText && (
                  <div>
                    To print the page press cmd and <br /> P in your keyboard
                  </div>
                )
              )}

              {firstStep && (
                <Link
                  asButtonVariant="secondary"
                  href={firstStep}
                  data-testid={'start-again-link'}
                >
                  <span className="block w-full text-center">
                    {z({ en: 'Start again', cy: 'Dechrau eto' })}
                  </span>
                </Link>
              )}
            </div>
          )}

          <div
            className={`${
              mainContentContainerClass ?? 'border-slate-400 mb-8'
            }`}
          >
            <div className={`${mainContentClass ?? 'pt-8 pb-8'}`}>
              {mainContent}
            </div>
          </div>
        </div>
        {extraContent && <div className={' mb-8'}>{extraContent}</div>}
      </div>
    </Container>
  );
};
