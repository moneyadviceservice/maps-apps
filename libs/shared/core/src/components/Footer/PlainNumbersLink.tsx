import Image from 'next/image';

const PLAIN_NUMBERS_URL = 'https://plainnumbers.org.uk/moneyandpensionsservice';

const linkClasses =
  'inline-block cursor-pointer p-1 border-b-4 border-transparent outline-none focus:bg-yellow-400 focus:border-purple-500 active:bg-transparent active:border-transparent';

const PlainNumbersLink = () => (
  <a href={PLAIN_NUMBERS_URL} className={linkClasses}>
    <Image
      src="/footer/wwp-logo.svg"
      className="w-[128px] h-[68px]"
      width={128}
      height={68}
      alt="Plain Numbers Working Together logo"
    />
  </a>
);

export default PlainNumbersLink;
