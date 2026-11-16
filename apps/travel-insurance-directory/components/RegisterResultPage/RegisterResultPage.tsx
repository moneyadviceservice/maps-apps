import { CopyItem } from 'data/pages/register/eligibility';
import { StringReplace } from 'utils/helper/StringReplace';

import { Link } from '@maps-react/common/components/Link';
import { Paragraph } from '@maps-react/common/components/Paragraph';

const renderCopy = (copyItem: CopyItem) => {
  if (copyItem.placeholder) {
    const { ref, value } = copyItem.placeholder;
    return StringReplace({
      stringValue: copyItem.content,
      placeholder: ref,
      replacePartValue: <Link href={`mailto:${value}`}>{value}</Link>,
    });
  } else {
    return copyItem.content;
  }
};

type Props = {
  copy: CopyItem[];
};

export const RegisterResultPage = ({ copy }: Props) => {
  return copy.map((copyItem, index) => {
    const key = `paragraph-${index}`;
    return (
      <Paragraph
        key={key}
        className={`mb-6 text-lg ${copyItem.style}`}
        data-testid={`copyItemContent-${index}`}
      >
        {renderCopy(copyItem)}
      </Paragraph>
    );
  });
};
