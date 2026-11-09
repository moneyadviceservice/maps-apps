import { Button } from '@maps-react/common/components/Button';
import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

export type AccountRegistrationCalloutVariant =
  | 'reregistration'
  | 'reregistration_resume'
  | 'registration_incomplete'
  | 'registration_not_approved';

const calloutContent: Record<
  AccountRegistrationCalloutVariant,
  { heading: string; body: string; buttonLabel: string }
> = {
  reregistration: {
    heading: 'You need to reregister your firm',
    body: 'Reregistering will ensure your firm remains in our Travel insurance directory.',
    buttonLabel: 'Get started',
  },
  reregistration_resume: {
    heading: 'You need to reregister your firm',
    body: 'Reregistering will ensure your firm remains in our Travel insurance directory.',
    buttonLabel: 'Resume your reregistration',
  },
  registration_incomplete: {
    heading: 'Registration incomplete',
    body: `You have saved your progress. Complete the remaining sections to submit your firm's details for the Travel Insurance Directory.`,
    buttonLabel: 'Continue',
  },
  registration_not_approved: {
    heading: 'Registration not approved',
    body: 'Your firm does not meet the medical specialism threshold for the Travel Insurance Directory. Review your answers on the confirm details page.',
    buttonLabel: 'Continue',
  },
};

export type AccountRegistrationCalloutProps = Readonly<{
  variant: AccountRegistrationCalloutVariant;
  href: string;
  /** Final expiration / registration anniversary date for renewal banners. */
  expirationDateLabel?: string;
}>;

export function AccountRegistrationCallout({
  variant,
  href,
  expirationDateLabel,
}: AccountRegistrationCalloutProps) {
  const { heading, body, buttonLabel } = calloutContent[variant];
  const isRenewalBanner =
    variant === 'reregistration' || variant === 'reregistration_resume';

  const bodyText =
    isRenewalBanner && expirationDateLabel
      ? `${body} Your firm's registration expires on ${expirationDateLabel}.`
      : body;

  return (
    <div className="space-y-3">
      <Heading level="h3" component="h2" className="text-gray-800">
        {heading}
      </Heading>
      <Paragraph className="m-0 text-gray-800">{bodyText}</Paragraph>
      <Button as="a" href={href}>
        {buttonLabel}
      </Button>
    </div>
  );
}
