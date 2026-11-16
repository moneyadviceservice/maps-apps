import { H3 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import {
  NotificationBox,
  NotificationBoxVariant,
} from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const AutoEnrolmentCallout = () => {
  const { z } = useTranslation();

  return (
    <div
      className={`col-span-12 xl:col-span-10 mb-6 lg:mb-8`}
      data-testid="notification-box-auto-enrolment"
    >
      <NotificationBox
        variant={NotificationBoxVariant.INFORMATION}
        className="mt-6"
      >
        <H3 className="leading-[36px] text-2xl md:text-2xl font-semibold mb-4 text-gray-800">
          {z({
            en: 'You could be missing out on money for your pension',
            cy: 'Gallech fod yn colli allan ar arian ar gyfer eich pensiwn',
          })}
        </H3>

        <Paragraph>
          {z({
            en: "You've told us that you earn at least £10,000 a year, if you are also over 22 but still under State Pension age, your employer should normally offer to include you in their workplace pension scheme. This is called “auto-enrolment”.",
            cy: 'Rydych wedi dweud wrthym eich bod yn ennill o leiaf £10,000 y flwyddyn, os ydych hefyd dros 22 oed ond yn dal o dan oedran Pensiwn y Wladwriaeth, dylai eich cyflogwr fel arfer gynnig eich cynnwys yn eu cynllun pensiwn gweithle. Gelwir hyn yn “gofrestru awtomatig”.',
          })}
        </Paragraph>
        <Paragraph>
          {z({
            en: 'It can be an effective way to build a pension pot, because when you contribute money, your employer contributes on top and you can also pay less tax.',
            cy: "Gall fod yn ffordd effeithiol o adeiladu cronfa bensiwn, oherwydd pan fyddwch chi'n cyfrannu arian, mae'ch cyflogwr yn cyfrannu ar ei ben a gallwch hefyd dalu llai o dreth.",
          })}
        </Paragraph>
        <Paragraph>
          {z({
            en: (
              <>
                Find out more about{' '}
                <Link href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/pensions-basics/automatic-enrolment-an-introduction">
                  how pension auto-enrollment works
                </Link>
                .
              </>
            ),
            cy: (
              <>
                Darganfyddwch fwy am{' '}
                <Link href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/pensions-basics/automatic-enrolment-an-introduction">
                  sut mae cofrestru awtomatig pensiwn yn gweithio
                </Link>
                .
              </>
            ),
          })}
        </Paragraph>
      </NotificationBox>
    </div>
  );
};
