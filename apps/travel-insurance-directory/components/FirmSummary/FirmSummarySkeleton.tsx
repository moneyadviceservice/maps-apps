import { InformationCallout } from '@maps-react/common/components/InformationCallout';

/**
 * Skeleton placeholder matching FirmSummary layout (same size/structure).
 * Shown while filter results are loading (e.g. after onChange).
 */
export const FirmSummarySkeleton = () => (
  <InformationCallout className="p-6 pb-8 border-gray-95 border-3 rounded-bl-3xl max-w-[948px]">
    <div className="mb-4 h-8 w-3/4 max-w-md rounded bg-gray-200 animate-pulse" />
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 pb-4 border-b-1 border-gray-300 gap-4 md:gap-0">
      <div className="w-full">
        <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-3" />
        <div className="space-y-2">
          <div className="h-5 w-full max-w-sm rounded bg-gray-200 animate-pulse" />
          <div className="h-5 w-2/3 max-w-xs rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
      <div className="h-6 w-28 rounded bg-gray-200 animate-pulse shrink-0" />
    </div>
    <div className="space-y-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-gray-300">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-5 w-24 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-6 w-full max-w-[10rem] rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-5 w-28 rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-6 w-full max-w-[8rem] rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </InformationCallout>
);
