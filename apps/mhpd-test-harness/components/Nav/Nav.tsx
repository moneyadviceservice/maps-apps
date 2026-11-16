import Link from 'next/link';

export const Nav = () => {
  const buttonClasses =
    'text-white hover:bg-pink-600 py-4 px-6 inline-block font-semibold';
  return (
    <nav
      className="flex items-center gap-4 -mt-12 bg-[#0f19a0] px-12 mb-12"
      data-testid="nav"
    >
      <Link className={buttonClasses} href="/composer">
        Create Test Data Scenario
      </Link>
      <Link className={buttonClasses} href="/composer/scenarios">
        Scenarios List
      </Link>
    </nav>
  );
};
