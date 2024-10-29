import { useTranslation } from '@maps-react/hooks/useTranslation';
import { ReactNode } from 'react';
import { ExpandableSection } from '@maps-react/common/components/ExpandableSection';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { ListElement } from '@maps-react/common/components/ListElement';

export const questionHelp = (
  z: ReturnType<typeof useTranslation>['z'],
): Record<number, ReactNode> => {
  return {
    1: z({
      en: (
        <ExpandableSection title="Not sure?">
          <Paragraph className="font-semibold">Ask the customer:</Paragraph>
          <ListElement
            items={[
              'Have you already missed a payment?',
              'Are you likely to miss an upcoming payment?',
              'Are you taking on new debt to pay existing debt?',
            ]}
            color="blue"
            variant="unordered"
            className="ml-4 pl-4 mb-6"
          />
          <Paragraph>
            If the answer is 'yes' to any of these, your customer could benefit
            from Debt Advice.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection title="Ddim yn siŵr?">
          <Paragraph className="font-semibold">Gofynnwch y cwsmer:</Paragraph>
          <ListElement
            items={[
              'Ydych chi eisoes wedi methu taliad?',
              "Ydych chi'n debygol o fethu taliad sydd i ddod?",
              "Ydych chi'n cymryd dyled newydd i dalu dyled bresennol?",
            ]}
            color="blue"
            variant="unordered"
            className="ml-4 pl-4 mb-6"
          />
          <Paragraph>
            Os mai 'ydw' yw'r ateb i unrhyw un o'r rhain, gall eich cwsmer elwa
            o Gyngor ar Ddyledion.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
  };
};
