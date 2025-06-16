import {
  ExpandableSection,
  H2,
  ListElement,
  Paragraph,
} from '@maps-react/common/index';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { usefulContacts } from '../../../data/form-content/text/results';
import { Country } from '../../../utils/parseStoredData';

type Props = {
  country: Country;
};

export const UsefulContacts = ({ country }: Props) => {
  const { z } = useTranslation();

  const contactsMap = [
    [1, 2, 3, 4, 5, 6], // England
    [1, 2, 3, 4, 5, 6, 9, 10], // Scotland
    [1, 2, 3, 4, 5, 6], // Wales
    [1, 4, 7, 8], // Northern Ireland
  ];

  return (
    <>
      <H2 className="mb-8 md:text-5xl" color="text-blue-800">
        {z({ en: 'Useful contacts', cy: 'Cysylltiadau defnyddiol' })}
      </H2>

      {contactsMap[country].map((section, i) => {
        const usefulContact = usefulContacts(z)[section];

        return (
          <div key={`useful-contacts-${i}`}>
            <hr className="border-slate-400" />
            <ExpandableSection title={usefulContact.title}>
              {usefulContact.intro && (
                <Paragraph className="mt-2">{usefulContact.intro}</Paragraph>
              )}
              <ListElement
                color="blue"
                variant="unordered"
                className="mb-2 ml-4 list-inside"
                items={usefulContact.items.map((item, i) => (
                  <span
                    key={`${usefulContact.title}-c${i}`}
                    className={`inline ${
                      i > 0 ? 'mt-4' : `${usefulContact.intro ? '' : 'mt-2'}`
                    }`}
                  >
                    {item}
                  </span>
                ))}
              ></ListElement>
            </ExpandableSection>
          </div>
        );
      })}
      <hr className="border-slate-400" />
    </>
  );
};
