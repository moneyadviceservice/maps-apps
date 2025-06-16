import { v4 as uuidv4 } from 'uuid';

import { ListElement } from '@maps-react/common/index';

type Props = {
  title: string;
  items: React.ReactNode[];
};

export const Checklist = ({ title, items }: Props) => {
  return (
    <>
      <p className="pb-[8px]">{title}</p>
      <ListElement
        variant="none"
        color="none"
        className="w-full"
        items={items.map((item) => {
          return (
            <span key={uuidv4()} className="flex flex-row py-[4px]">
              <svg
                className="max-w-[24px] mx-[8px] my-[2px]"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22 6.82796L13.6637 16.0556C11.3426 18.6248 7.43393 18.6515 5.08073 16.1144L2 12.7929L4.84303 9.92571L7.92375 13.2472C8.70815 14.093 10.0111 14.084 10.7847 13.2276L19.1211 4L22 6.82796Z"
                  fill="#008021"
                />
              </svg>
              {item}
            </span>
          );
        })}
      />
    </>
  );
};
