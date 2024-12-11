import { PropsWithChildren, useEffect, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import { BackLink } from '@maps-react/common/components/BackLink';
import { Button } from '@maps-react/common/components/Button';
import { H1 } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Container } from '@maps-react/core/components/Container';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { APIS, PATHS, QUESTION_PREFIX } from '../../CONSTANTS';

type Props = {
  heading: string;
  backLink?: string;
  copyText?: string;
  copyButtonLabel?: string;
} & PropsWithChildren;

export const LastPageWrapper = ({
  heading,
  backLink,
  copyText,
  copyButtonLabel,
  children,
}: Props) => {
  const { z, locale } = useTranslation();

  const [displayCopyButton, setDisplayCopyButton] = useState(false);

  useEffect(() => setDisplayCopyButton(!!copyText), [copyText]);

  const handleCopy = () => {
    copyText &&
      navigator.clipboard
        .writeText(copyText)
        .catch((error) => console.error('Failed to copy text: ', error));
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
              variant="link"
              className="!gap-0 text-[18px]"
              onClick={handleCopy}
              data-testid="copy-to-clipboard-button"
            >
              {copyButtonLabel}
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
            variant="secondary"
            type="button"
            as="a"
            href={`/${locale}/${PATHS.START}/${QUESTION_PREFIX}1`}
            data-testid="restart-tool-button"
            data-cy="restart-tool-button"
            className="w-full sm:w-auto"
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
