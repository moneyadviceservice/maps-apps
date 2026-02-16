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
        <ExpandableSection
          title="How to find out what help the customer needs"
          contentTestClassName="my-2"
        >
          <Paragraph className="font-semibold mb-2">
            Ask these questions:
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
            could benefit from debt advice.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection
          title="Sut i ddarganfod pa help sydd ei angen ar y cwsmer"
          contentTestClassName="my-2"
        >
          <Paragraph className="font-semibold mb-2">
            Gofynnwch y cwestiynau hyn:
          </Paragraph>
          <ListElement
            items={[
              'Ydych chi eisoes wedi colli taliad?',
              "Ydych chi'n debygol o golli taliad sy'n ar ddod?",
              "Ydych chi'n cymryd dyled newydd i dalu dyled bresennol?",
            ]}
            color="blue"
            variant="unordered"
            className={listClassNames}
          />
          <Paragraph>
            Os yw&apos;r ateb yn &apos;ydw&apos; i unrhyw un o&apos;r rhain,
            gallai eich cwsmer elwa o gyngor ar ddyledion.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
  };
};
