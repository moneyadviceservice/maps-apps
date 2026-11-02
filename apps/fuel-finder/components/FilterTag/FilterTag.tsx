import { useRouter } from 'next/router';

import XFilter from '@maps-react/common/assets/images/x-filter.svg';
import { Link } from '@maps-react/common/components/Link';

export interface FilterTagProps {
  title: string;
  href: string;
  description: string;
  announcementText?: string;
}

const FilterTag = ({
  title,
  href,
  description,
  announcementText,
}: FilterTagProps) => {
  const router = useRouter();

  const notifyFilterRemoval = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const announcements = document.querySelector(
      '.t-filter-announcements',
    ) as HTMLElement;

    announcements.textContent = announcementText || `"${title}" filter removed`;

    router.push(href);

    setTimeout(() => {
      announcements.textContent = '';
    }, 500);
  };

  return (
    <div
      className="inline-block px-4 py-1 border rounded t-active-filters-item border-slate-400 shadow-bottom-gray"
      data-testid="filter-tag"
    >
      <div className="flex items-center space-x-2 text-pink-800 text-xs">
        <div>{title}</div>
        <Link
          href={href}
          scroll={false}
          title={description}
          aria-label={description}
          onClick={notifyFilterRemoval}
          data-testid="remove-filter"
        >
          <XFilter />
        </Link>
      </div>
    </div>
  );
};

export default FilterTag;
