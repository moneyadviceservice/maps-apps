import { PropsWithChildren, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { APIS } from '../../CONSTANTS';

type Props = {
  heading: string;
  lang: string;
  backLink?: string;
  copyText?: string;
} & PropsWithChildren;

export const LastPageWrapper = ({
  heading,
  lang,
  backLink,
  copyText,
  children,
}: Props) => {
  const { z } = useTranslation();

  const copyButtonLabel = z({
    en: 'Copy these details',
    cy: 'Copïwch y manylion hyn',
  });

  const copyButtonLabelSuccess = z({
    en: 'Details copied',
    cy: "Manylion wedi'u copïo",
  });

  const [displayCopyButton, setDisplayCopyButton] = useState(false);
  const [displayCopySuccess, setDisplayCopySuccess] = useState(false);

  useEffect(() => setDisplayCopyButton(!!copyText), [copyText]);

  const handleCopy = () => {
    copyText &&
      navigator.clipboard
        .writeText(copyText)
        .catch((error) => console.error('Failed to copy text: ', error))
        .finally(() => {
          setDisplayCopySuccess(true);
          setTimeout(() => setDisplayCopySuccess(false), 3000);
        });
  };

  return (
    <Container>
      {backLink && (
        <BackLink href={backLink}>
          {z({
            en: 'Back',
            cy: 'Yn ôl',
          })}
        </BackLink>
      )}
      <div className={twMerge('lg:max-w-[840px] mt-8')}>
        <H1 className="mb-4">{heading}</H1>
        {children}
        {displayCopyButton && (
          <Paragraph>
            <Button
              variant="secondary"
              className="!gap-0 text-[18px] mt-2"
              onClick={handleCopy}
              data-testid="copy-to-clipboard-button"
            >
              {displayCopySuccess ? copyButtonLabelSuccess : copyButtonLabel}
            </Button>
          </Paragraph>
        )}
        <div className="pt-4 space-y-4 sm:space-x-8">
          <Button
            variant="primary"
            type="button"
            as="a"
            href={`/${APIS.LOGOUT}`}
            data-testid="sign-out-button"
            data-cy="sign-out-button"
            className="w-full sm:w-auto"
          >
            {z({
              en: 'Sign out',
              cy: 'Allgofnodi',
            })}
          </Button>
          <Button
            as="a"
            variant="link"
            href={`/${APIS.RESTART_TOOL}?lang=${lang}&restart=true`}
            data-testid="restart-tool-button"
            data-cy="restart-tool-button"
            className="w-full font-bold sm:w-auto"
          >
            {z({
              en: 'Make another referral',
              cy: 'Gwneud atgyfeiriad arall',
            })}
          </Button>
        </div>
      </div>
    </Container>
  );
};
