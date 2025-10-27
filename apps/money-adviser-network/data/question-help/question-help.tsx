import { ReactNode } from 'react';

import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { ListElement } from '@maps-react/common/components/ListElement';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { useTranslation } from '@maps-react/hooks/useTranslation';

const listClassNames = 'ml-4 pl-4 mb-6 space-y-4';

export const questionHelp = (
  z: ReturnType<typeof useTranslation>['z'],
): Record<number, ReactNode> => {
  return {
    1: z({
      en: (
        <ExpandableSection title="Not sure?" contentTestClassName="my-2">
          <Paragraph className="font-semibold mb-2">
            Ask the customer:
          </Paragraph>
          <ListElement
            items={[
              'Have you already missed a payment?',
              'Are you likely to miss an upcoming payment?',
              'Are you taking on new debt to pay existing debt?',
            ]}
            color="blue"
            variant="unordered"
            className={listClassNames}
          />
          <Paragraph>
            If the answer is &apos;yes&apos; to any of these, your customer
            could benefit from Debt Advice.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection title="Ddim yn siŵr?" contentTestClassName="my-2">
          <Paragraph className="font-semibold mb-2">
            Gofynnwch y cwsmer:
          </Paragraph>
          <ListElement
            items={[
              'Ydych chi eisoes wedi methu taliad?',
              "Ydych chi'n debygol o fethu taliad sydd i ddod?",
              "Ydych chi'n cymryd dyled newydd i dalu dyled bresennol?",
            ]}
            color="blue"
            variant="unordered"
            className={listClassNames}
          />
          <Paragraph>
            Os mai &apos;ydw&apos; yw&apos;r ateb i unrhyw un o&apos;r rhain,
            gall eich cwsmer elwa o Gyngor ar Ddyledion.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
  };
};
