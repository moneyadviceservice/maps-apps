import { useRouter } from 'next/router';

export const useTabNavigation = (
  nextTabId: string | undefined,
  onEnableNext: (id: string) => void,
) => {
  const router = useRouter();

  const onNextClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>,
  ) => {
    if (nextTabId) {
      e.preventDefault();
      onEnableNext(nextTabId);
      router.push(`/?tab=${nextTabId}`, undefined, { shallow: true });
    }
  };

  return { onNextClick };
};
