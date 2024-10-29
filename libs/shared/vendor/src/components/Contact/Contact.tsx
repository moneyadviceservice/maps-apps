import Link from 'next/link';
import { useRef, useState } from 'react';
import slug from 'slug';
import ContactContainer from './ContactContainer';
import FocusTrap from 'focus-trap-react';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { useLanguage } from '@maps-react/hooks/useLanguage';
import { useTranslation } from '@maps-react/hooks/useTranslation';
import ContactStepOne from './ContactStepOne';
import ContactStepTwo from './ContactStepTwo';
import ContactStepThreeCard from './ContactStepThree';
import { twMerge } from 'tailwind-merge';

enum TypeOptions {
  telephone = 'telephone',
  webForm = 'webForm',
  webChat = 'webChat',
  whatsapp = 'whatsapp',
}

const commonClasses = [
  't-chat-button',
  'fixed',
  'flex',
  'md:flex-col',
  'shadow-bottom-gray',
  'outline-0',
  'bottom-4',
  'bg-white',
  'right-4',
  'justify-between',
  'min-w-[12.063rem]',
  'md:min-w-0',
  'md:min-h-[7.1rem]',
  'md:align-bottom',
  'md:top-[40%]',
  'md:bottom-auto',
  'md:right-0',
  'border',
  'solid',
  'rounded',
  'md:rounded-l',
  'md:rounded-r-none',
  'border-pink-600',
  'md:border-r-0',
  'py-1.5',
  'px-2.5',
  'md:p-2.5',
  'hover:bg-gray-100',
  'hover:text-pink-800',
  'focus:text-grey-800',
  'focus:bg-yellow-200',
  'focus:border-purple-700',
  'focus:border-2',
  'focus:shadow-none',
];

export const Contact = () => {
  const { z } = useTranslation();
  const lang = useLanguage();
  const [type, setType] = useState('');
  const [step, setStep] = useState(0);
  const [guidance, setGuidance] = useState('');

  const guidanceList = [
    { pensions: z({ en: 'Pensions', cy: 'pensiynau' }) },
    { money: z({ en: 'Money', cy: 'Ariannol' }) },
  ] as Record<string, string>[];

  const typesList = [
    { telephone: z({ en: 'Telephone', cy: 'Ffôn' }) },
    { webForm: z({ en: 'Web form', cy: 'Ffurflen ar‑lein' }) },
    { webChat: z({ en: 'Web chat', cy: ' Gwesgwrs' }) },
  ] as Record<string, string>[];

  guidance === 'money'
    ? typesList.push({ whatsapp: 'WhatsApp' })
    : typesList.filter((type) => type['whatsApp']);

  const closeCTA = () => setStep(0);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="print:hidden" data-testid="contact">
      {step === 0 && (
        <div className="fixed top-0 right-0">
          <button
            data-testid="contact-open"
            className={twMerge(commonClasses)}
            onClick={() => setStep(1)}
          >
            <div className="t-chat-button-icon flex justify-center md:self-center">
              <Icon type={IconType.HAND_SHAKE} />
            </div>

            <div
              className={`t-chat-button-text text-lg font-bold text-end md:text-left self-center ${
                lang === 'cy' ? 'md:max-w-[5.188rem]' : 'md:max-w-[3.438rem]'
              }`}
            >
              {z({ en: 'Talk to us live', cy: 'Siaradwch â ni yn fyw' })}
            </div>
          </button>
        </div>
      )}

      {step !== 0 && (
        <>
          <FocusTrap
            focusTrapOptions={{
              allowOutsideClick: true,
              initialFocus: false,
            }}
          >
            <ContactContainer
              step={step}
              guidance={guidance}
              type={type}
              onClose={closeCTA}
              onBack={() => setStep(step - 1)}
              backLabel={z({ en: 'Previous', cy: 'Blaenorol' })}
              closeLabel={z({ en: 'Close', cy: 'Cau' })}
              ref={ref}
            >
              {step === 1 && (
                <ContactStepOne
                  handleType={(value: string) => {
                    setStep(2);
                    setGuidance(value);
                  }}
                  guidanceList={guidanceList}
                />
              )}
              {step === 2 && (
                <ContactStepTwo
                  handleTypeContact={(t) => {
                    setStep(3);
                    setType(t);
                  }}
                  typesList={typesList}
                />
              )}
              {step === 3 && type === TypeOptions.telephone && (
                <TelephoneContact type={type} guidance={guidance} />
              )}
              {step === 3 && type === TypeOptions.webForm && (
                <WebFormContact type={type} guidance={guidance} />
              )}
              {step === 3 && type === TypeOptions.webChat && (
                <WebChatContact type={type} guidance={guidance} />
              )}
              {step === 3 && type === TypeOptions.whatsapp && (
                <WhatsAppContact type={type} />
              )}
            </ContactContainer>
          </FocusTrap>
          <div
            data-testid="contact-close"
            className="t-overlay fixed inset-0 w-screen h-screen bg-gray-800 opacity-25"
            role="none"
            onClick={closeCTA}
          ></div>
        </>
      )}
    </div>
  );
};

const TelephoneContact = ({
  type,
  guidance,
}: {
  type: string;
  guidance: string;
}) => {
  const { z } = useTranslation();

  const telWeekday = z({ en: 'Mon-Fri', cy: 'Llun – Gwener' });
  const telWeekend = {
    title: z({
      en: 'Sun and bank holidays',
      cy: 'Sadwrn, Sul a gwyliau banc',
    }),
    value: z({ en: 'Closed', cy: 'Wedi cau' }),
  };
  const telMessage = z({
    en: 'Calls from the UK are free. We’re committed to providing you with a quality service, so calls may be recorded or monitored for training purposes and to help us develop our services.',
    cy: 'Mae galwadau o’r DU am ddim. Rydym wedi ymrwymo i ddarparu gwasanaeth o safon i chi, felly gellir recordio neu fonitro galwadau at ddibenion hyfforddiant ac i’n helpu i ddatblygu ein gwasanaethau.',
  });

  const telContent = {
    pensions: {
      phone: '0800 011 3797',
      otherPhones: [
        {
          title: z({ en: 'From Overseas', cy: 'O dramor' }),
          num: '+44 20 7932 5780',
        },
        {
          title: z({ en: 'For self-employed', cy: 'I’r hunangyflogedig' }),
          num: '0345 602 7021',
        },
      ],
      openHours: [
        {
          title: telWeekday,
          value: '9.00am – 5.00pm',
        },
        telWeekend,
      ],
      text: telMessage,
    },
    money: {
      phone: '0800 138 7777',
      otherPhones: [
        { title: 'English', num: '0800 138 0555' },
        {
          title: z({ en: 'Typetalk', cy: 'Typetalk' }),
          num: '18001 0800 915 4622',
        },
        {
          title: z({ en: 'From Overseas', cy: 'O dramor' }),
          num: '+44 20 3553 2279',
        },
      ],
      openHours: [
        {
          title: telWeekday,
          value: '8.00am – 6.00pm',
        },
        telWeekend,
      ],
      text: telMessage,
    },
  } as Record<
    string,
    {
      phone: string;
      otherPhones: { title: string; num: string }[];
      openHours: { title: string; value: string }[];
      text: string;
    }
  >;

  const content = telContent[guidance];

  return (
    <>
      <ContactStepThreeCard
        type={type}
        content={content.phone}
        link={'tel://' + content.phone}
      />
      <ul className="w-full">
        {content.otherPhones.map((v) => {
          return (
            <li key={slug(v.title)} className="pb-4 flex">
              <p className="min-w-[7.5rem] w-auto">{v.title + ':'}</p>
              <Link
                href={'tel://' + v.num}
                className="text-pink-600 outline-0 underline pl-3 hover:no-underline hover:text-pink-900 focus:no-underline focus:text-gray-800 focus:bg-yellow-200 focus:shadow-link-focus"
              >
                {v.num}
              </Link>
            </li>
          );
        })}
      </ul>
      <table className="table-fixed border border-slate-400 border-x-0 border-t-0 mt-10 w-full text-base">
        <thead>
          <tr className="border border-slate-400 border-x-0 border-t-0">
            <th className="text-left">{z({ en: 'Hours', cy: 'Oriau' })}</th>
          </tr>
        </thead>
        <tbody>
          {content.openHours.map((v) => {
            return (
              <tr
                key={slug(v.title)}
                className="border border-slate-400 border-x-0"
              >
                <td className="pb-2 pt-2 max-w-[7.5rem]">{v.title + ':'}</td>
                <td className="pb-2 pt-2 font-bold">{v.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="my-4 w-full">{content.text}</p>
    </>
  );
};

const WebChatContact = ({
  type,
  guidance,
}: {
  type: string;
  guidance: string;
}) => {
  const { z } = useTranslation();

  const webChatLabel = z({ en: 'Start webchat', cy: 'Dechrau gwesgwrs' });

  const webChatWeekdayLabel = z({ en: 'Mon-Fri', cy: 'Llun – Gwener' });

  const webChatWeekendLabel = {
    title: z({
      en: 'Sun and bank holidays',
      cy: 'Sadwrn, Sul a gwyliau banc',
    }),
    value: z({ en: 'Closed', cy: 'Wedi cau' }),
  };

  const webchatcontent = {
    pensions: {
      label: webChatLabel,
      link: 'https://www.moneyhelper.org.uk/pensionschat',
      openHours: [
        {
          title: webChatWeekdayLabel,
          value: '9.00am – 6.00pm',
        },
        webChatWeekendLabel,
      ],
    },
    money: {
      label: webChatLabel,
      link: 'https://webchat.moneyhelper.org.uk/newchat/chat.aspx?domain=www.moneyhelper.org.uk',
      openHours: [
        {
          title: webChatWeekdayLabel,
          value: '8.00am – 6.00pm',
        },
        { title: z({ en: 'Sat', cy: 'Sadwrn' }), value: '8.00am – 3.00pm' },
        webChatWeekendLabel,
      ],
    },
  } as Record<
    string,
    {
      label: string;
      link: string;
      openHours: { title: string; value: string }[];
    }
  >;

  const content = webchatcontent[guidance];

  return (
    <>
      <ContactStepThreeCard
        type={type}
        link={content.link}
        content={content.label}
      />
      <table className="table-fixed border border-slate-400 border-x-0 border-t-0 w-full text-base">
        <thead>
          <tr className="border border-slate-400 border-x-0 border-t-0">
            <th className="text-left">{z({ en: 'Hours', cy: 'Oriau' })}</th>
          </tr>
        </thead>
        <tbody>
          {content.openHours.map((key) => {
            return (
              <tr
                key={slug(key.value)}
                className="border border-slate-400 border-x-0"
              >
                <td className="pb-2 pt-2 max-w-[7.5rem]">{key.title + ':'}</td>
                <td className="pb-2 pt-2 font-bold">{key.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const WhatsAppContact = ({ type }: { type: string }) => {
  const { z } = useTranslation();

  return (
    <>
      <ContactStepThreeCard
        type={type}
        link="https://wa.me/447701342744"
        content="+44 77 0134 2744"
      />
      <div className="flex pb-4">
        <Paragraph>{z({ en: 'Download app', cy: 'Lawrlwythwch' })}</Paragraph>
        <Link
          href="https://www.whatsapp.com/download/"
          target="_blank"
          className="underline text-pink-800 pl-1 hover:no-underline hover:text-pink-900 focus:no-underline focus:text-gray-800 focus:bg-yellow-200 focus:shadow-link-focus"
        >
          WhatsApp
        </Link>
      </div>
      <Paragraph>
        {z({
          en: 'For help sorting out your debts or credit questions. For everything else please contact us via Webchat or telephone.',
          cy: 'Am help i ddatrys eich dyledion neu gwestiynau credyd. Am bopeth arall cysylltwch â ni trwy Wegswrs neu dros y ffôn.',
        })}
      </Paragraph>
    </>
  );
};

const WebFormContact = ({
  type,
  guidance,
}: {
  type: string;
  guidance: string;
}) => {
  const { z } = useTranslation();

  const webFormText = (n: number) => {
    return z({
      en: `We aim to respond within ${n} working days`,
      cy: `Ein nod yw ymateb o fewn ${n} diwrnod gwaith.`,
    });
  };

  const onlineLinkLabel = {
    link: 'https://www.moneyhelper.org.uk/en/contact-us/money-guidance/money-guidance-enquiry-form',
    label: z({ en: 'Open web form', cy: 'Agor ffurflen we' }),
  };

  const onlineformcontent = {
    pensions: {
      ...onlineLinkLabel,
      text: webFormText(5),
    },
    money: {
      ...onlineLinkLabel,
      text: webFormText(2),
    },
  } as Record<
    string,
    {
      link: string;
      label: string;
      text: string;
    }
  >;

  const content = onlineformcontent[guidance];

  return (
    <>
      <ContactStepThreeCard
        type={type}
        link={content.link}
        content={content.label}
      />
      <Paragraph>{content.text}</Paragraph>
    </>
  );
};

export default Contact;
