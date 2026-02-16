import HyphenIcon from '@maps-react/common/assets/images/hyphen.svg';
import Plus from '@maps-react/common/assets/images/plus.svg';
import useTranslation from '@maps-react/hooks/useTranslation';

type AdditionalInfoButtonProps = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  describedBy: string;
  z: ReturnType<typeof useTranslation>['z'];
};

export const AdditionalInfoButton = ({
  expanded,
  setExpanded,
  describedBy,
  z,
}: AdditionalInfoButtonProps) => (
  <div className="border rounded-md  border-magenta-500">
    <button
      type="button"
      className="
        relative
        flex items-center justify-center w-full
        min-h-[48px]
        bg-white
        px-5 lg:px-6
        py-2
        gap-x-2.5
        rounded
        text-magenta-500
        text-center font-semibold text-base leading-6 tracking-[0.16px]
        outline-none
        shadow-bottom-gray
        hover:bg-gray-50
        focus:bg-yellow-400
        focus:outline-blue-700
        focus:outline-[3px]
        focus:outline-offset-0
        focus:text-gray-800
        focus:shadow-none
        focus:before:content-['']
        focus:before:absolute
        focus:before:inset-0
        focus:before:inset-x-[-3px]
        focus:before:inset-y-[-3px]
        focus:before:w-[calc(100%+6px)]
        focus:before:rounded-[0.45rem]
        focus:before:shadow-bottom-gray
        active:text-gray-800
      "
      onClick={() => setExpanded((s) => !s)}
      aria-expanded={expanded}
      aria-describedby={describedBy}
      data-testid="button-filters"
    >
      <span className="flex items-center">
        {expanded ? <HyphenIcon /> : <Plus />}
      </span>

      <span>
        {expanded
          ? z({
              en: 'Hide extra information here',
              cy: 'Cuddio gwybodaeth ychwanegol yma',
            })
          : z({
              en: 'Add extra information here',
              cy: 'Ychwanegu gwybodaeth ychwanegol yma',
            })}
      </span>
    </button>
  </div>
);
