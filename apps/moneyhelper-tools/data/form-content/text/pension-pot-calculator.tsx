import { useTranslation } from '@maps-react/hooks/useTranslation';
import { Link } from '@maps-digital/shared/ui';
import { ReactNode } from 'react';
import { DataPath } from 'types';

export type PensionPotCalculator = {
  title: string;
  information?: ReactNode;
  calloutMessage?: ReactNode;
  calloutMessageResults?: ReactNode;
  errorTitle: string;
  buttonText: string;
  submittedButtonText: string;
  resultsButtonText: string;
  resultTitle: string;
};

const sharedText = {
  textLine1: `Amcangyfrif yw hwn — mae'r union swm o dreth a dalwch yn dibynnu ar gyfanswm eich incwm ar gyfer y flwyddyn a'ch cyfradd treth.`,
  textLine2: 'Os ydych yn yr Alban bydd eich cyfrifiad yn wahannol.',
};

const defaults = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculator => {
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
    submittedButtonText: t({
      en: 'Recalculate',
      cy: 'Ailgyfrifo',
    }),
    resultsButtonText: t({
      en: 'Apply changes',
      cy: 'Gwneud newidiadau',
    }),
    calloutMessage: t({
      en: (
        <p>
          If the total value of your pensions, including those you’ve already
          taken money from, is close to or more than £1 million, your tax-free
          amount might be different. If you’re in this situation, it’s important
          to get regulated financial advice before you access your pension.{' '}
          <Link
            asInlineText
            target="_blank"
            href="https://www.moneyhelper.org.uk/en/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
          >
            Find a retirement adviser.
          </Link>
        </p>
      ),
      cy: (
        <p>
          Os yw cyfanswm gwerth eich pensiynau, gan gynnwys y rhai yr ydych
          eisoes wedi cymryd arian ohonynt, yn agos at neu’n fwy na £1 miliwn,
          gallai eich swm di-dreth fod yn wahanol. Os ydych chi yn y sefyllfa
          hon, mae’n bwysig cael cyngor ariannol wedi’i reoleiddio cyn i chi
          gael mynediad i’ch pensiwn.{''}
          <Link
            asInlineText
            target="_blank"
            href="https://www.moneyhelper.org.uk/cy/pensions-and-retirement/taking-your-pension/find-a-retirement-adviser"
          >
            Dewch o hyd i gynghorydd ymddeoliad.
          </Link>
        </p>
      ),
    }),
    resultTitle: t({
      en: 'Your results',
      cy: 'Eich canlyniadau',
    }),
    calloutMessageResults: t({
      en: (
        <p>
          This is an estimate — the exact amount of tax you pay depends on your
          total income for the year and your tax rate
        </p>
      ),
      cy: (
        <ul className="list-disc pl-6">
          <li className="mb-2">{sharedText.textLine1}</li>
          <li>{sharedText.textLine2}</li>
        </ul>
      ),
    }),
  };
};

const cashInChunksText = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculator => {
  return defaults(t);
};

const takeWholePot = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculator => {
  return {
    ...defaults(t),
    title: t({
      en: 'Estimate what you’d get after tax',
      cy: 'Amcangyfrif o beth fyddwch yn ei gael ar ôl treth',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            This calculation assumes you are entitled to 25% of your total pot
            as a tax-free lump sum.
          </li>
          <li>
            This is an estimate — the exact amount of tax you pay depends on
            your total income for the year and your tax rate.
          </li>
        </ul>
      ),
      cy: (
        <ul>
          <li>
            Mae{"'"}r cyfrifiad hwn yn tybio bod gennych hawl i 25% o gyfanswm
            eich pot fel cyfandaliad di-dreth.
          </li>
          <li>{sharedText.textLine1}</li>
          <li>{sharedText.textLine2}</li>
        </ul>
      ),
    }),
  };
};

const guaranteedIncomeEstimator = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculator => {
  return {
    ...defaults(t),
    title: t({
      en: 'Estimate how much your guaranteed income could be',
      cy: 'Amcangyfrif o faint allai eich incwm gwarantedig fod',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            This estimate is for a single-life non-escalating annuity.
          </li>
          <li>
            You may wish to choose a joint-life annuity that pays your spouse or
            partner after you die, or an enhanced annuity which pays more if you
            smoke or have a medical condition.
          </li>
        </ul>
      ),
      cy: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            Mae hwn yn amcangyfrif ar gyfer blwydd-dal bywyd sengl.
          </li>
          <li className="mb-2">
            Efallai yr hoffech ddewis blwydd-dal cydfywyd sy’n talu’ch priod
            neu’ch partner ar ôl i chi farw, neu flwydd-dal uwch sy’n talu mwy
            os ydych yn ysmygu neu os oes gennych gyflwr meddygol.
          </li>
          <li>{sharedText.textLine2}</li>
        </ul>
      ),
    }),
  };
};

const leavePotUntouched = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculator => {
  return {
    ...defaults(t),
    title: t({
      en: 'Estimate how much your pot could grow',
      cy: 'Amcangyfrif o faint allai eich cronfa dyfu',
    }),
    calloutMessageResults: t({
      en: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            This is an estimate based on your whole pot growing at a rate of
            about 3% per year — this may vary.
          </li>
          <li className="mb-2">
            The amount in your pot will be affected by inflation and any fees
            your provider charges.
          </li>
          <li>
            You must leave your whole pot — you can{"'"}t take just the 25%
            tax-free lump sum and leave the rest.
          </li>
        </ul>
      ),
      cy: (
        <ul className="list-disc pl-6">
          <li className="mb-2">
            Mae hwn yn amcangyfrif yn seiliedig ar eich cronfa gyfan yn tyfu ar
            gyfradd o tua 3% y flwyddyn — gallai hyn amrywio.
          </li>
          <li className="mb-2">
            Bydd y swm yn eich cronfa yn cael ei effeithio gan chwyddiant ac
            unrhyw ffioedd mae eich darparwr yn eu codi.
          </li>
          <li>
            Mae{"'"}n rhaid i chi adael eich gornfa gyfan — ni allwch gymryd y
            lwmp swm 25% di-dreth a gadael y gweddill.
          </li>
        </ul>
      ),
    }),
  };
};

const ajustableIncomeEstimator = (
  t: ReturnType<typeof useTranslation>['z'],
): PensionPotCalculator => {
  return {
    ...defaults(t),
    calloutMessageResults: t({
      en: (
        <>
          <li className="mb-2">
            You could pay Income Tax on your monthly income.
          </li>
          <li className="mb-2">
            This is an estimate based on the amount in your pot growing at a
            rate of about 3% per year — this may vary.
          </li>
          <li className="mb-2">
            No allowance has been made for inflation, you may wish to consider
            how this will affect the buying power of this income.
          </li>
          <li>
            If you have a very large pot, your tax-free amount could be
            different. This depends on whether you’ve gone over the lifetime
            allowance (LTA), whether you’ve registered for LTA protection,
            whether you are liable for LTA tax charges, and whether you’ve
            already taken money from your pot.
          </li>
        </>
      ),
      cy: (
        <>
          <li className="mb-2">
            Gallech dalu Treth Incwm ar eich incwm misol.
          </li>
          <li className="mb-2">
            Mae hwn yn amcangyfrif yn seiliedig ar y swm yn eich cronfa yn tyfu
            ar gyfradd o tua 3% y flwyddyn — gallai hyn amrywio.
          </li>
          <li className="mb-2">{sharedText.textLine2}</li>
          <li>
            Os oes gennych gronfa fawr iawn, gallai eich swm di-dreth fod yn
            wahanol. Mae hyn yn dibynnu a ydych wedi mynd dros y lwfans oes
            (LTA), p’un a ydych wedi cofrestru ar gyfer amddiffyniad LTA, a
            ydych yn atebol am daliadau treth LTA, ac a ydych eisoes wedi cymryd
            arian o’ch cronfa.
          </li>
        </>
      ),
    }),
  };
};

export const getText = (
  z: ReturnType<typeof useTranslation>['z'],
  path: DataPath,
): PensionPotCalculator => {
  switch (path) {
    case DataPath.CashInChunksCalculator:
      return cashInChunksText(z);
    case DataPath.TakeWholePot:
      return takeWholePot(z);
    case DataPath.GuaranteedIncomeEstimator:
      return guaranteedIncomeEstimator(z);
    case DataPath.LeavePotUntouched:
      return leavePotUntouched(z);
    case DataPath.AjustableIncomeEstimator:
      return ajustableIncomeEstimator(z);
    default:
      return {} as PensionPotCalculator;
  }
};
