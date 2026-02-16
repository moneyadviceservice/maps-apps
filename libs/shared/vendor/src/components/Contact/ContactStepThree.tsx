import Link from 'next/link';

import { Icon, IconType } from '@maps-react/common/components/Icon';

const ContactStepThreeCard = ({
  type,
  content,
  link,
}: {
  type: string;
  content: string;
  link: string;
}) => {
  return (
    <Link
      href={link}
      target={type !== 'telephone' ? '_blank' : '_self'}
      className="right-0 flex w-full px-4 py-2 mr-2 text-xl text-magenta-500 bg-white border border-magenta-500 rounded t-chat-panel-button-inline outline-0 shadow-bottom-gray top-1/2 my-7 solid hover:bg-gray-100 hover:text-pink-800 focus:text-gray-800 focus:bg-yellow-400 focus:border-purple-700 focus:border-2 focus:shadow-none"
    >
      {type === 'webChat' && <Icon type={IconType.WEB_CHAT} />}
      {type === 'telephone' && <Icon type={IconType.TELEPHONE} />}
      {type === 'webForm' && <Icon type={IconType.WEB_FORM} />}
      {type === 'whatsapp' && <Icon type={IconType.WHATSAPP} />}

      <span className="pl-2.5 font-semibold">{content}</span>
    </Link>
  );
};

export default ContactStepThreeCard;
