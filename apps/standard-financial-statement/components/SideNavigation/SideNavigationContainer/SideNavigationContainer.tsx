import {
  forwardRef,
  MouseEvent,
  MutableRefObject,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';

import FocusTrap from 'focus-trap-react';
import { twMerge } from 'tailwind-merge';

import { Icon, IconType } from '@maps-react/common/components/Icon';
import useOnClickOutside from '@maps-react/hooks/useOnClickOutside';
import useTranslation from '@maps-react/hooks/useTranslation';

const RenderChildrenWithRef = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => (
    <div
      ref={ref as MutableRefObject<HTMLDivElement>}
      data-testid={'nav-content'}
    >
      {children}
    </div>
  ),
);

RenderChildrenWithRef.displayName = 'RenderChildrenWithRef';

type Props = {
  language: string;
} & PropsWithChildren;

export const SideNavigationContainer = ({ language, children }: Props) => {
  const { z } = useTranslation();
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
  });

  function handleNavigation(event: MouseEvent) {
    event.preventDefault();
    setIsNavigationOpen(!isNavigationOpen);
  }

  const navigationRef = useRef() as MutableRefObject<HTMLDivElement>;
  useOnClickOutside(navigationRef, () => setIsNavigationOpen(false));

  return (
    <>
      <div className="sticky bottom-0 z-10 order-2 left-4 right-4 lg:hidden">
        <details
          className="relative h-screen overflow-y-scroll bg-white rounded-t-lg group z-3 max-h-fit"
          open={isNavigationOpen}
        >
          <summary
            title={
              isNavigationOpen
                ? z({ en: 'Close menu', cy: 'Cau dewislen' })
                : z({ en: 'Explore this topic', cy: 'Explore this topic' })
            }
            className={twMerge(
              isNavigationOpen ? 'close' : 'open',
              'relative z-20 bg-blue-600 cursor-pointer list-none [&::-webkit-details-marker]:hidden text-center text-white text-[18px]',
            )}
            onClick={(e) => handleNavigation(e)}
            data-testid="side-nav-toggle"
          >
            <div className="flex items-center p-4 h-[55px]">
              <span className="text-green-300">
                {z({ en: 'Explore this topic', cy: 'Explore this topic' })}
              </span>
              <div className="ml-auto text-white -rotate-90 group-open:hidden">
                <Icon className="text-green-300" type={IconType.CHEVRON} />
              </div>
              <div className="items-center hidden ml-auto group-open:flex">
                <Icon
                  type={IconType.BURGER_CLOSE}
                  className="w-[20px] h-[20px] text-white"
                />
                <span className="text-[14px]">
                  {z({
                    en: 'Close',
                    cy: 'Cau',
                  })}
                </span>
              </div>
            </div>
          </summary>
          {isNavigationOpen && (
            <FocusTrap
              active={isNavigationOpen}
              focusTrapOptions={{
                escapeDeactivates: false,
                initialFocus: false,
              }}
            >
              <RenderChildrenWithRef ref={navigationRef}>
                {children}
              </RenderChildrenWithRef>
            </FocusTrap>
          )}
        </details>
      </div>
      <div className="hidden lg:block">{children}</div>
    </>
  );
};
