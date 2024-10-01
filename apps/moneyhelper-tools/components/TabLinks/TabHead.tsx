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

type Props = {
  children: ReactNode;
};

const navClasses =
  'print:hidden t-step-navigation flex space-x-4 snap-x overflow-x-scroll scroll smooth-scroll scrollbar-hide ease-in-out duration-10 whitespace-nowrap sm:mr-0 py-8';

const buttonClasses =
  'absolute top-1/2 transform -translate-y-1/2 shrink-0 text-pink-800 bg-white border-1 border-pink-600 rounded drop-shadow-lg px-3.5 py-3';

export const TabHead = forwardRef(
  (
    { children }: Props,
    ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    const navRef = useRef<HTMLElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

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
      if (activeLinkRef && navRef.current) {
        navRef.current.scrollTo({
          left:
            activeLinkRef.offsetLeft -
            navRef.current.clientWidth / 2 +
            activeLinkRef.clientWidth / 2,
        });
      }
    }, [ref]);

    return (
      <div className="relative">
        {canScrollLeft && (
          <button
            data-testid="button:left-arrow"
            className={`${buttonClasses} left-0`}
            onClick={scrollLeft}
          >
            <Icon type={IconType.CHEVRON} className="rotate-180" />
          </button>
        )}
        <nav ref={navRef} className={navClasses} data-testid={'nav-tab-list'}>
          {children}
        </nav>
        {canScrollRight && (
          <button
            data-testid="button:right-arrow"
            className={`${buttonClasses} right-0`}
            onClick={scrollRight}
          >
            <Icon type={IconType.CHEVRON} />
          </button>
        )}
      </div>
    );
  },
);

TabHead.displayName = 'TabHead';
