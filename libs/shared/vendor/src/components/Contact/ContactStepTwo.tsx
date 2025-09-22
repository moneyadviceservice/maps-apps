import { Icon, IconType } from '@maps-react/common/components/Icon';

const ContactStepTwo = ({
  handleTypeContact,
  typesList,
}: {
  handleTypeContact: (value: string) => void;
  typesList: Record<string, string>[];
}) => {
  return (
    <>
      {typesList.map((val) => {
        const t = Object.keys(val).toString();
        return (
          <button
            key={t}
            data-testid={t}
            className="t-chat-panel-icon-button bg-white shadow-bottom-gray outline-0 top-1/2 mr-2 mt-4 right-0 border solid rounded border-magenta-500 py-3 px-4 min-w-[8.5rem] w-[47%] text-xl text-magenta-500 hover:bg-gray-100 hover:text-pink-800 focus:text-gray-800 focus:bg-yellow-400 focus:border-purple-700 focus:border-2 focus:shadow-none"
            onClick={() => handleTypeContact(t)}
          >
            {t && (
              <div className="flex justify-left">
                {t === 'webChat' && <Icon type={IconType.WEB_CHAT} />}
                {t === 'telephone' && <Icon type={IconType.TELEPHONE} />}
                {t === 'webForm' && <Icon type={IconType.WEB_FORM} />}
                {t === 'whatsapp' && <Icon type={IconType.WHATSAPP} />}
              </div>
            )}
            <div className="font-semibold sm:whitespace-nowrap text-left pt-2.5">
              {val[t]}
            </div>
          </button>
        );
      })}
    </>
  );
};

export default ContactStepTwo;
