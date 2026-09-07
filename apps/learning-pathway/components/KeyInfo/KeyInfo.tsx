import { GroupedTag } from 'lib/types/site.type';

import { H4, ListElement, Paragraph } from '@maps-react/common/index';
import { RichTextAem } from '@maps-react/vendor/components/RichTextAem';
import {
  mapJsonRichText,
  Node,
} from '@maps-react/vendor/utils/RenderRichText/RenderRichText';

export type KeyInfoProps = {
  tags: GroupedTag[];
  owner: string;
  dateAccredited: string;
  dateLaunched: string;
  preRequisite: string;
  furtherInfo: Node[];
  title: string;
  ownerTitle: string;
  accreditedDateTitle: string;
  launchedDateTitle: string;
  furtherInfoTitle: string;
  preRequisiteTitle: string;
};

const KeyInfo = ({
  tags,
  owner,
  dateAccredited,
  dateLaunched,
  preRequisite,
  furtherInfo,
  title,
  ownerTitle,
  accreditedDateTitle,
  launchedDateTitle,
  furtherInfoTitle,
  preRequisiteTitle,
}: KeyInfoProps) => {
  return (
    <div data-testid="key-info" className="pr-2 mt-8">
      <H4 data-testid="key-info-heading">{title}</H4>
      <div className="space-y-10">
        <div className="text-base font-normal mt-4 space-y-4">
          {tags.map((tagGroup) => {
            const items = tagGroup.tags.map((t) => t.label);
            return (
              <div key={tagGroup.key}>
                <Paragraph className="mb-2 font-semibold">
                  {tagGroup.group}
                </Paragraph>
                <ListElement
                  variant="unordered"
                  color="dark"
                  items={items}
                  className="ml-8"
                />
              </div>
            );
          })}
        </div>
        <div>
          <div>
            <Paragraph className="mb-2 font-semibold">{ownerTitle}</Paragraph>
            <Paragraph className="font-normal">{owner}</Paragraph>
          </div>
          <div>
            <Paragraph className="mb-2 font-semibold">
              {accreditedDateTitle}
            </Paragraph>
            <Paragraph className="font-normal">{dateAccredited}</Paragraph>
          </div>
          <div>
            <Paragraph className="mb-2 font-semibold">
              {launchedDateTitle}
            </Paragraph>
            <Paragraph className="font-normal"> {dateLaunched}</Paragraph>
          </div>
          <div>
            <Paragraph className="mb-2 font-semibold">
              {preRequisiteTitle}
            </Paragraph>
            <Paragraph className="font-normal">{preRequisite}</Paragraph>
          </div>
        </div>
        <div>
          <Paragraph className="font-semibold mb-2">
            {furtherInfoTitle}
          </Paragraph>
          <div
            className="text-magenta-500 font-normal"
            data-testid="key-info-further-info-links"
          >
            <RichTextAem>{mapJsonRichText(furtherInfo)}</RichTextAem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyInfo;
