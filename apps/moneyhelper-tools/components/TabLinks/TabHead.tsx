import {
  useRef,
  useState,
  useEffect,
  ReactNode,
  forwardRef,
  ForwardedRef,
  RefObject,
} from 'react';
import { Icon, IconType } from '@maps-react/common/components/Icon';
import { twMerge } from 'tailwind-merge';

type Props = {
  children: ReactNode;
};

const navClasses = `print:hidden t-step-navigation flex space-x-4 snap-x overflow-x-scroll scroll smooth-scroll scrollbar-hide ease-in-out duration-10 whitespace-nowrap sm:mr-0 py-8`;

const buttonClasses =
  'absolute top-1/2 transform -translate-y-1/2 shrink-0 text-pink-800 bg-white border-1 border-pink-600 rounded drop-shadow-lg px-3.5 py-3 z-10';

export const TabHead = forwardRef(
  (
    { children }: Props,
    ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    const navRef = useRef<HTMLElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const hasScroll = canScrollLeft || canScrollRight;

    const checkScrollable = () => {
      if (navRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    const scrollLeft = () => {
      if (navRef.current) {
        navRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      }
    };

    const scrollRight = () => {
      if (navRef.current) {
        navRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      }
    };

    useEffect(() => {
      checkScrollable();
      const navRefCurrent = navRef.current;
      if (navRefCurrent) {
        navRefCurrent.addEventListener('scroll', checkScrollable);
      }
      window.addEventListener('resize', checkScrollable);

      return () => {
        if (navRefCurrent) {
          navRefCurrent.removeEventListener('scroll', checkScrollable);
        }
        window.removeEventListener('resize', checkScrollable);
      };
    }, []);

    useEffect(() => {
      const activeLinkRef = (
        ref as RefObject<HTMLButtonElement | HTMLAnchorElement>
      )?.current;

      if (activeLinkRef && hasScroll) {
        activeLinkRef.scrollIntoView({
          block: 'nearest',
          inline: 'center',
        });
      }
    }, [ref, hasScroll]);

    return (
      <div className="relative">
        {hasScroll && (
          <button
            data-testid="button:left-arrow"
            className={twMerge(
              buttonClasses,
              'left-0',
              !canScrollLeft && 'opacity-40',
            )}
            onClick={scrollLeft}
            aria-label="previous"
            disabled={!canScrollLeft}
            aria-disabled={!canScrollLeft}
          >
            <Icon type={IconType.CHEVRON} className="rotate-180" />
          </button>
        )}
        <nav
          ref={navRef}
          className={twMerge(navClasses, hasScroll ? 'mx-12' : 'mx-0')}
          data-testid={'nav-tab-list'}
          role="tablist"
        >
          {children}
        </nav>
        {hasScroll && (
          <button
            data-testid="button:right-arrow"
            className={twMerge(
              buttonClasses,
              'right-0',
              !canScrollRight && 'opacity-40',
            )}
            onClick={scrollRight}
            aria-label="next"
            disabled={!canScrollRight}
            aria-disabled={!canScrollRight}
          >
            <Icon type={IconType.CHEVRON} />
          </button>
        )}
      </div>
    );
  },
);

TabHead.displayName = 'TabHead';
