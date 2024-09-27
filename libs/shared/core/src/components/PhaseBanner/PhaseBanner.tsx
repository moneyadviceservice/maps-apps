import { Link } from '@maps-react/common/components/Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export enum PhaseType {
  ALPHA = 'alpha',
  BETA = 'beta',
}
export type PhaseBannerProps = {
  phase?: PhaseType;
  link?: string;
};

export const PhaseBanner = ({
  phase = PhaseType.BETA,
  link,
}: PhaseBannerProps) => {
  const { z } = useTranslation();

  return (
    <div className="md:container-auto">
      <div
        className="mt-3 pb-4 border-b-1 border-slate-400 flex items-center leading-[23px]"
        data-testid="phase-banner"
      >
        <span className="mr-3 py-[5px] px-[8px] uppercase text-sm font-bold bg-pink-600 text-white">
          {phase}
        </span>
        <span>
          {z({
            en: 'This is a new service - your',
            cy: 'Mae hwn yn wasanaeth newydd - bydd eich',
          })}
          &nbsp;
          {link ? (
            <Link target="_blank" href={link} asInlineText>
              {z({
                en: 'feedback',
                cy: 'adborth',
              })}
            </Link>
          ) : (
            <>
              {z({
                en: 'feedback',
                cy: 'adborth',
              })}
            </>
          )}
          &nbsp;
          {z({
            en: 'will help us to improve it.',
            cy: `yn ein helpu i'w wella`,
          })}
        </span>
      </div>
    </div>
  );
};
