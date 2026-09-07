import { InformationCallout } from '@maps-react/common/components/InformationCallout';

const pulse = 'rounded bg-gray-200 animate-pulse';

/**
 * Visual placeholder mirroring StationCard layout while filter/sort changes
 * trigger an SSR re-render. Decorative — the wrapping list region carries
 * `aria-busy` / `aria-live`, so each tile is hidden from assistive tech.
 */
export const StationCardSkeleton = () => (
  <InformationCallout testClass="station" variant="withShadow">
    <div
      data-testid="station-card-skeleton"
      aria-hidden="true"
      className="px-6 pt-6 pb-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <div className={`${pulse} h-8 w-3/4 max-w-md`} />
          <div className={`${pulse} h-5 w-32 mt-3`} />
        </div>
        <div className={`${pulse} h-10 w-24 mt-3 lg:mt-0 lg:shrink-0`} />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <div className={`${pulse} h-7 w-28`} />
        <div className={`${pulse} h-7 w-24`} />
      </div>

      <hr className="my-4 border-slate-400" />

      <div className={`${pulse} h-6 w-40`} />
      <div className={`${pulse} h-5 w-2/3 max-w-sm mt-2`} />
      <div className={`${pulse} h-5 w-56 mt-3`} />

      <hr className="my-4 border-slate-400" />

      <div className={`${pulse} h-6 w-44`} />
    </div>
  </InformationCallout>
);

export default StationCardSkeleton;
