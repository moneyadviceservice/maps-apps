import { useRouter } from 'next/router';

import XFilter from '@maps-react/common/assets/images/x-filter.svg';
import { Link } from '@maps-react/common/components/Link';
import useTranslation from '@maps-react/hooks/useTranslation';

interface FilterProps {
  title: string;
  href: string;
  description: string;
}

const Filter = ({ title, href, description }: FilterProps) => {
  const router = useRouter();
  const { z } = useTranslation();

  const notifyFilterRemoval = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const announcements = document.querySelector(
      '.t-filter-announcements',
    ) as HTMLElement;

    announcements.textContent = z(
      {
        en: '"{title}" filter removed',
        cy: '"{title}" hidlydd wedi\'i dynnu',
      },
      { title: title },
    );

    router.push(href);

    setTimeout(() => {
      announcements.textContent = '';
    }, 500);
  };

  return (
    <div
      className="inline-block px-2 py-1 border-2 rounded-lg t-active-filters-item border-slate-400 shadow-bottom-gray"
      data-testid="filter-container"
    >
      <div className="flex items-center space-x-2 text-pink-800">
        <div>{title}</div>
        <Link
          href={href}
          scroll={false}
          title={description}
          aria-label={description}
          onClick={notifyFilterRemoval}
          data-testid="remove-filter-icon"
        >
          <XFilter />
        </Link>
      </div>

      <div
        className="hidden t-filter-announcements"
        data-testid="announcement-container"
      ></div>
    </div>
  );
};

export default Filter;
