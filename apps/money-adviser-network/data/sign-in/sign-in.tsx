import { Heading, Link, Paragraph } from '@maps-digital/shared/ui';
import useTranslation from '@maps-react/hooks/useTranslation';
import { ReactNode } from 'react';

export const pageTitles = (t: ReturnType<typeof useTranslation>['z']) => {
  return {
    title: t({
      en: 'Sign In - Money Adviser Network',
      cy: 'Sign In - Money Adviser Network',
    }),
  };
};

export const signInContent = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string | ReactNode> => {
  return {
    title: t({
      en: 'Debt advice referral',
      cy: 'Atgyfeiriad am gyngor ar ddyledion',
    }),
    landing: t({
      en: 'Money Advisor Network',
      cy: 'Rhwydwaith Cynghorwyr Arian',
    }),
    formTitle: t({
      en: 'Sign in to your partner account',
      cy: `Mewngofnodwch i'ch cyfrif partner`,
    }),
    debtAdviceTitle: t({
      en: 'Help customers get debt advice',
      cy: 'Help customers get debt advice',
    }),
    errorTitle: t({
      en: 'There is a problem',
      cy: 'Mae yna broblem',
    }),
    formContent: t({
      en: (
        <>
          <Heading level="h3" className="mb-4">
            Problem signing in?
          </Heading>
          <Paragraph className="text-[18px]">
            Please contact{' '}
            <Link href="mailto:moneyadvisornetwork@maps.org.uk" target="_blank">
              moneyadvisornetwork@maps.org.uk
            </Link>
          </Paragraph>
        </>
      ),
      cy: (
        <>
          <Heading level="h3" className="mb-4">
            Problemau mewngofnodi?
          </Heading>
          <Paragraph className="text-[18px]">
            Cysylltwch â{' '}
            <Link href="mailto:moneyadvisornetwork@maps.org.uk" target="_blank">
              moneyadvisornetwork@maps.org.uk
            </Link>
          </Paragraph>
        </>
      ),
    }),
    debtAdviceContent: t({
      en: (
        <>
          <Heading level="h3" className="mb-3 md:text-4xl">
            Help customers get debt advice
          </Heading>
          <Paragraph className="mb-4 text-[18px]">
            Use this service to refer customers for free personalised debt
            advice.
          </Paragraph>
          <Paragraph className="mt-8 mb-6 text-[18px]">
            To be eligible, the customer must:
          </Paragraph>

          <ul className="pl-6 mb-10 text-lg list-disc marker:text-blue-800">
            <li className="mb-4 text-[18px]">
              Have missed payments or struggling to make payments
            </li>
            <li className="mb-4 text-[18px]">
              Not be currently receiving free debt advice
            </li>
            <li className="mb-4 text-[18px]">Live in England</li>
            <li className="mb-4 text-[18px]">Not be self-employed</li>
          </ul>

          <Paragraph className="text-[18px]">
            If you need access to refer customers, contact:
            <Link href="mailto:moneyadvisornetwork@maps.org.uk" target="_blank">
              moneyadvisornetwork@maps.org.uk
            </Link>
          </Paragraph>

          <Heading level="h4" className="mt-8 mb-4 md:text-4xl">
            Business debt?
          </Heading>
          <Paragraph className="text-[18px]">
            If the customer has business debt, direct them to Business Debtline.
          </Paragraph>
          <Paragraph className="mb-1 text-[18px]">
            Tel:{' '}
            <a href="tel:08001976026" className="text-gray-800">
              0800 197 6026
            </a>
          </Paragraph>
          <Paragraph className="mb-1 text-[18px]">
            Monday to Friday: 9am - 8pm
          </Paragraph>
          <Link
            target="_blank"
            href="www.businessdebtline.org"
            className="text-[18px] text-gray-800"
          >
            www.businessdebtline.org
          </Link>
        </>
      ),
      cy: (
        <>
          <Heading level="h3" className="mb-3 md:text-4xl">
            Helpu cwsmeriaid i gael cyngor ar ddyledion
          </Heading>
          <Paragraph className="mb-4 text-[18px]">
            Defnyddiwch y gwasanaeth hwn i atgyfeirio cwsmeriaid am gyngor ar
            ddyledion personol am ddim.
          </Paragraph>
          <Paragraph className="mt-8 mb-6 text-[18px]">
            I fod yn gymwys, rhaid i'r cwsmer:
          </Paragraph>
          <ul className="pl-6 mb-10 text-lg list-disc marker:text-blue-800">
            <li className="mb-4 text-[18px]">
              Wedi methu taliadau neu wedi cael trafferth i wneud taliadau
            </li>
            <li className="mb-4 text-[18px]">
              Beidio â chael cyngor ar ddyledion am ddim ar hyn o bryd
            </li>
            <li className="mb-4 text-[18px]">Byw yn Lloegr</li>
            <li className="mb-4 text-[18px]">
              Ddim yn hunangyflogedig neu'n gyfarwyddwr cwmni 
            </li>
          </ul>
          <Paragraph className="text-[18px]">
            Os oes angen mynediad arnoch i atgyfeirio cwsmeriaid, cysylltwch â:
            <Link href="mailto:moneyadvisornetwork@maps.org.uk" target="_blank">
              moneyadvisornetwork@maps.org.uk
            </Link>
          </Paragraph>
          <Heading level="h4" className="mt-8 mb-4 md:text-4xl">
            Dyled busnes?
          </Heading>
          <Paragraph className="text-[18px]">
            Os oes gan y cwsmer dyled busnes, dylech ei anfon at Business
            Debtline.
          </Paragraph>
          <Paragraph className="mb-1 text-[18px]">
            Ffn:{' '}
            <a href="tel:08001976026" className="text-gray-800">
              0800 197 6026
            </a>
          </Paragraph>
          <Paragraph className="mb-1 text-[18px]">
            Llun i ddydd Gwener: 9am - 8pm
          </Paragraph>
          <Link
            target="_blank"
            href="www.businessdebtline.org"
            className="text-[18px] text-gray-800"
          >
            www.businessdebtline.org
          </Link>
        </>
      ),
    }),
  };
};

export type SignInFields = {
  name: string;
  label: string;
  info?: string;
  errors: {
    required: string;
    invalid?: string;
  };
};

export const signInFields = (
  t: ReturnType<typeof useTranslation>['z'],
): SignInFields[] => {
  return [
    {
      name: 'username',
      label: t({
        en: 'Username',
        cy: 'Enw defnyddiwr',
      }),
      info: t({
        en: 'Please enter username provided by MaPS',
        cy: 'Please enter username provided by MaPS',
      }),
      errors: {
        required: t({
          en: 'Please enter your username.',
          cy: 'Mae angen enw defnyddiwr.',
        }),
        invalid: t({
          en: `This username hasn't been recognised.`,
          cy: 'Mae angen cyfrinair.',
        }),
      },
    },
    {
      name: 'password',
      label: t({
        en: 'Password',
        cy: 'Cyfrinair',
      }),
      errors: {
        required: t({
          en: 'Please enter your password.',
          cy: 'Mae angen cyfrinair.',
        }),
        invalid: t({
          en: 'The password you entered is incorrect.',
          cy: `Mae'r cyfrinair rydych wedi'i rhoi yn anghywir. `,
        }),
      },
    },
  ];
};