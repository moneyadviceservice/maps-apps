import { ReactNode } from 'react';

import { ExpandableSection, Paragraph } from '@maps-react/common/index';
import useTranslation from '@maps-react/hooks/useTranslation';

export const questionHelp = (
  z: ReturnType<typeof useTranslation>['z'],
): Record<number, ReactNode> => {
  return {
    1: z({
      en: (
        <ExpandableSection
          title="Why are we asking?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Where to get free debt advice depends on where you live.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection
          title="Pam rydyn ni'n gofyn?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Mae ble i gael cyngor ar ddyledion am ddim yn dibynnu ar ble rydych
            chi'n byw.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
    2: z({
      en: (
        <ExpandableSection
          title="Why are we asking?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Where to get free debt advice depends on where your income comes
            from.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection
          title="Pam rydyn ni'n gofyn?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Mae ble i gael cyngor ar ddyledion am ddim yn dibynnu ar o ble mae
            eich incwm yn dod.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
    3: z({
      en: (
        <ExpandableSection
          title="Why are we asking?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            The debt advice service you choose depends on how you'd like to
            speak to an adviser.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection
          title="Pam rydyn ni'n gofyn?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Mae'r gwasanaeth cyngor ar ddyledion a ddewiswch yn dibynnu ar sut
            yr hoffech siarad ag ymgynghorydd.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
    4: z({
      en: (
        <ExpandableSection
          title="Why are we asking?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Where to get local in-person debt advice depends on your location.
          </Paragraph>
        </ExpandableSection>
      ),
      cy: (
        <ExpandableSection
          title="Pam rydyn ni'n gofyn?"
          contentTestClassName="my-2"
        >
          <Paragraph className="text-[18px] mb-2">
            Mae ble i gael cyngor dyledion lleol wyneb yn wyneb yn dibynnu ar
            eich lleoliad.
          </Paragraph>
        </ExpandableSection>
      ),
    }),
  };
};
