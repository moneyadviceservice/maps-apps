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
  introElement?: React.ElementType;
  extraContent?: ReactNode;
  mainContentContainerClass?: string;
  mainContentClass?: string;
  displayActionButtons?: boolean;
  removeEmbedFromUrl?: boolean;
  copyUrlText?: TranslationGroupString;
  layout?: Layout;
  headingClassName?: 'primary' | 'secondary';
};

export const Results = ({
  heading,
  mainContent,
  backLink,
  firstStep,
  intro,
  introElement,
  extraContent,
  mainContentContainerClass,
  mainContentClass,
  displayActionButtons = true,
  removeEmbedFromUrl = true,
  copyUrlText,
  layout = 'default',
  headingClassName = 'primary',
}: Props) => {
  const { z } = useTranslation();

  const [isCopied, setIsCopied] = useState(false);
  const [liveMsg, setLiveMsg] = useState('');
  const liveRegionTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (liveRegionTimeout.current) clearTimeout(liveRegionTimeout.current);
    };
  }, []);
  const handleCopyButtonClick = () => {
    if (removeEmbedFromUrl) {
      const url = new URL(globalThis.location.href);
      const params = new URLSearchParams(url.search);
      params.delete('isEmbedded');
      url.search = params.toString();
      copy(url.toString());
    } else {
      copy(globalThis.location.href);
    }
    setIsCopied(true);
    setLiveMsg('');
    setTimeout(() => {
      setLiveMsg(z({ en: 'Link copied!', cy: `Dolen wedi'i chopïo!` }));
    }, 50);

    if (liveRegionTimeout.current) clearTimeout(liveRegionTimeout.current);
    liveRegionTimeout.current = setTimeout(() => {
      setIsCopied(false);
      setLiveMsg('');
    }, 3000);
  };

  const defaultCopyText: TranslationGroupString = {
    en: 'Copy your results link',
    cy: 'Copïwch eich dolen canlyniadau',
  };

  const copyButtonText = isCopied
    ? z({ en: 'Link copied!', cy: `Dolen wedi'i chopïo!` })
    : z(copyUrlText ?? defaultCopyText);

  const Container = layout === 'grid' ? GridStepContainer : StepContainer;

  // Default to Paragraph if nullish (null or undefined)
  const IntroElement = introElement ?? Paragraph;

  return (
    <Container backLink={backLink}>
      <div className="mt-8 md:mb-8">
        <H1
          data-testid={`results-page-heading`}
          id={`results-page-heading`}
          className={twMerge(intro === undefined ? 'mb-0 sm:mb-6 lg:mb-8' : '')}
          variant={headingClassName}
        >
          {heading}
        </H1>
        {intro && (
          <IntroElement
            className={`max-w-[840px] mb-8`}
            data-testid={'results-intro'}
          >
            {intro}
          </IntroElement>
        )}
        <div className="flex flex-col-reverse sm:flex-col">
          {displayActionButtons && (
            <div className="flex flex-col gap-4 mb-6 lg:mb-8 sm:flex-row">
              {copyUrlText ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleCopyButtonClick}
                    data-testid="copy-link"
                  >
                    <span aria-hidden={isCopied}>{copyButtonText}</span>
                  </Button>
                  {/* Visually hidden live region for screen readers */}
                  <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                    data-testid="live-region"
                  >
                    {liveMsg}
                  </div>
                </>
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
