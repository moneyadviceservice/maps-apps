import { useTranslation } from '@maps-react/hooks/useTranslation';
import { TranslationGroup } from '@maps-react/hooks/types';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { ForwardedRef, forwardRef } from 'react';

const ContactContainer = forwardRef(
  (
    {
      step,
      guidance,
      type,
      onClose,
      onBack,
      children,
      backLabel,
      closeLabel,
    }: {
      step: number;
      guidance: string;
      type: string;
      onClose: () => void;
      onBack: () => void;
      children: React.ReactNode;
      backLabel: string;
      closeLabel: string;
    },
    ref,
  ) => {
    return (
      <div
        className="t-chat-panel fixed top-0 right-0 bg-gray-100 h-screen max-w-[24.438rem] z-20"
        ref={ref as ForwardedRef<HTMLDivElement>}
      >
        <div className="flex flex-col-reverse flex-wrap-reverse">
          <ContactHeader step={step} guidance={guidance} type={type}>
            {children}
          </ContactHeader>
          <div className="bg-white p-3">
            <div
              className={`flex ${
                step === 1 ? 'justify-end' : 'justify-between'
              }`}
            >
              {(step === 2 || step === 3) && (
                <button
                  data-testid="contact-back"
                  className="t-chat-panel-previous flex flex-row justify-end items-center text-pink-600 hover:text-pink-900 hover:underline focus:text-gray-800 focus:bg-yellow-200 focus:shadow-link-focus outline-0"
                  onClick={onBack}
                >
                  <Icon type={IconType.CHEVRON_LEFT} />
                  <span className="text-base ml-1.5 flex">{backLabel}</span>
                </button>
              )}
              <button
                className="t-chat-panel-close flex flex-row justify-end items-center text-pink-600 hover:text-pink-900 hover:underline focus:text-gray-800 focus:bg-yellow-200 focus:shadow-link-focus outline-0"
                onClick={onClose}
              >
                <Icon
                  type={IconType.X_CLOSE}
                  className="text-pink-600"
                  fill="#c82a87"
                />
                <span className="text-lg font-bold text-gray-800 ml-1 flex">
                  {closeLabel}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

type TranslationGroupString = {
  readonly en: string;
  readonly cy: string;
};

const getTitles = (
  z: ReturnType<typeof useTranslation>['z'],
  guidance: string,
  type: string,
) => {
  const guidanceTypeSelected = (guidance: string) => {
    return guidance === 'pensions'
      ? z({ en: 'Pensions', cy: 'Pensiwn' }).toLowerCase()
      : z({ en: 'Money', cy: 'Ariannol' }).toLowerCase();
  };

  const titles = [
    z({ en: 'Talk to us live for...', cy: 'Siaradwch â ni yn fyw am...' }),
    z(
      {
        en: 'Talk to us live for {g} guidance using...',
        cy: 'Siaradwch â ni yn fyw am arweiniad {g} drwy ddefnyddio...',
      },
      {
        g: guidanceTypeSelected(guidance),
      },
    ),
  ];

  const contactOption: Record<
    string,
    { translations: TranslationGroup; type: TranslationGroupString }
  > = {
    telephone: {
      translations: {
        en: 'Talk to us live for {g} guidance using the {t}',
        cy: 'Siaradwch â ni yn fyw am arweiniad {g} drwy ddefnyddio’r {t}',
      },
      type: { en: 'telephone', cy: ' ffôn' },
    },
    webForm: {
      translations: {
        en: 'Talk to us for {g} guidance using our {t}',
        cy: 'Siaradwch â ni yn fyw am arweiniad {g} drwy ddefnyddio ein {t}',
      },
      type: { en: 'web form', cy: ' ffurflen we' },
    },
    webChat: {
      translations: {
        en: 'Talk to us live for {g} guidance using {t}',
        cy: 'Siaradwch â ni yn fyw am arweiniad {g} drwy ddefnyddio {t}',
      },
      type: { en: 'webchat', cy: ' gwesgwrs' },
    },
    whatsapp: {
      translations: {
        en: 'Talk to us live for {g} guidance using {t}',
        cy: 'Siaradwch â ni yn fyw am arweiniad {g} drwy ddefnyddio {t}',
      },
      type: { en: 'WhatsApp', cy: ' WhatsApp' },
    },
  };

  const selectedContactOption = ({
    translations,
    type,
  }: {
    translations: TranslationGroup;
    type: TranslationGroupString;
  }) => {
    return z(translations, {
      g: guidanceTypeSelected(guidance),
      t: z(type),
    });
  };

  if (type) {
    titles.push(selectedContactOption(contactOption[type]) as string);
  }

  return titles;
};

const ContactHeader = ({
  step,
  guidance,
  type,
  children,
}: {
  step: number;
  guidance: string;
  type: string;
  children: React.ReactNode;
}) => {
  const { z } = useTranslation();
  const titles = getTitles(z, guidance, type);

  const title = titles[step - 1];

  return (
    <div className="overflow-y-scroll h-4/5 md:h-full scroll-pb-2.5 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-pink-600 scrollbar-track-gray-100 md:overflow-hidden">
      <div
        className="t-chat-panel-title text-3xl text-blue-800 font-bold px-4 pt-3.5"
        data-testid="contact-title"
      >
        {title}
      </div>
      <div className="flex flex-row grow justify-between items-stretch px-4 flex-wrap">
        {children}
      </div>
    </div>
  );
};

export default ContactContainer;
