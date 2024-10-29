import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Link } from '@maps-digital/shared/ui';
import { ReactNode } from 'react';

export type CashInChunksText = {
  title: string;
  information?: ReactNode;
  calloutMessage?: ReactNode;
  errorTitle: string;
  buttonText: string;
};

export const cashInChunksText = (
  t: ReturnType<typeof useTranslation>['z'],
): CashInChunksText => {
  return {
    title: t({
      en: 'Estimate how much you could get',
      cy: 'Amcangyfrif o faint allwch chi ei gael',
    }),
    errorTitle: t({
      en: 'Unable to submit the form',
      cy: 'Methu anfon y ffurflen',
    }),
    buttonText: t({
      en: 'Calculate',
      cy: 'Cyfrifo',
    }),
    calloutMessage: t({
      en: (
        <p>
          If the total value of your pensions, including those you’ve already
          taken money from, is close to or more than £1 million, your tax-free
          amount might be different. If you’re in this situation, it’s important
          to get regulated financial advice before you access your pension.
          <Link
            asInlineText
            target="_blank"
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
          >
            Find a retirement adviser
          </Link>
        </p>
      ),
      cy: (
        <p>
          Os yw cyfanswm gwerth eich pensiynau, gan gynnwys y rhai yr ydych
          eisoes wedi cymryd arian ohonynt, yn agos at neu’n fwy na £1 miliwn,
          gallai eich swm di-dreth fod yn wahanol. Os ydych chi yn y sefyllfa
          hon, mae’n bwysig cael cyngor ariannol wedi’i reoleiddio cyn i chi
          gael mynediad i’ch pensiwn.
          <Link
            asInlineText
            target="_blank"
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
          >
            Dewch o hyd i gynghorydd ymddeoliad
          </Link>
        </p>
      ),
    }),
  };
};

export const pageData = (
  t: ReturnType<typeof useTranslation>['z'],
): Record<string, string> => {
  return {
    title: t({
      en: 'Take cash in chunks',
      cy: 'Cymryd arian allan fesul tipyn',
    }),
    description: t({
      en: 'Take cash in chunks',
      cy: 'Cymryd arian allan fesul tipyn',
    }),
  };
};
