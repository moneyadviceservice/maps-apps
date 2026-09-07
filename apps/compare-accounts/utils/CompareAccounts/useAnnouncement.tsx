import { useCallback, useState } from 'react';

export type AnnouncementPoliteness = 'polite' | 'assertive';

export type AnnounceOptions = {
  politeness?: AnnouncementPoliteness;
};

export type UseAnnouncementOptions = {
  defaultPoliteness?: AnnouncementPoliteness;
};

export const useAnnouncement = ({
  defaultPoliteness = 'assertive',
}: UseAnnouncementOptions = {}) => {
  const [state, setState] = useState<{
    message: string;
    politeness: AnnouncementPoliteness;
  }>({ message: '', politeness: defaultPoliteness });

  const announce = useCallback(
    (message: string, opts: AnnounceOptions = {}) => {
      setState({
        message,
        politeness: opts.politeness ?? defaultPoliteness,
      });
    },
    [defaultPoliteness],
  );

  return {
    announcement: state.message,
    announce,
    liveRegionProps: {
      className: 'sr-only',
      role: 'alert',
      'aria-live': state.politeness,
      'aria-atomic': 'true' as const,
      children: state.message,
    },
  };
};

export default useAnnouncement;
