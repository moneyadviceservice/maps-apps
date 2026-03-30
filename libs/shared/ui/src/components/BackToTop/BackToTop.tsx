import { Icon, IconType } from '../Icon';
import { Link } from '../Link';
import { useTranslation } from '@maps-react/hooks/useTranslation';

export const BackToTop = () => {
  const { z } = useTranslation();

  const focusTopAnchor = () => {
    const topEl = document.getElementById('main');

    if (!topEl) {
      return;
    }

    const hadTabIndex = topEl.hasAttribute('tabindex');
    if (!hadTabIndex) {
      topEl.setAttribute('tabindex', '-1');
    }

    topEl.focus();

    if (!hadTabIndex) {
      topEl.removeAttribute('tabindex');
    }
  };

  const updateHash = () => {
    if (globalThis.window === undefined) {
      return;
    }

    const { pathname, search } = globalThis.window.location;
    globalThis.window.history.replaceState(
      null,
      '',
      `${pathname}${search}#main`,
    );
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const currentScroll =
      globalThis.window.scrollY || document.documentElement.scrollTop;
    const jumpToPosition = currentScroll * 0.3; // Jump to 15% from top (85% of the way)

    // Jump instantly to 85% of current position
    globalThis.window.scrollTo(0, jumpToPosition);

    // Then smoothly animate the last 15% to top
    // Use double requestAnimationFrame to ensure the instant scroll completes first
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(() => {
        globalThis.window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        focusTopAnchor();
        updateHash();
      });
    });
  };

  return (
    <div className="flex items-start justify-start gap-2">
      <Link
        href="#main"
        className="text-sm text-magenta-500 visited:text-magenta-500"
        onClick={handleClick}
      >
        <Icon type={IconType.ARROW_UP} className="text-magenta-500" />
        <span>
          {z({
            en: 'Back to top',
            cy: "Nôl i'r brig",
          })}
        </span>
      </Link>
    </div>
  );
};
