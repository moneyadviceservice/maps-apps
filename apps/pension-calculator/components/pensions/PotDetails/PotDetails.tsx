import { PENSIONS_API, usePensionsForm } from 'hooks/usePensionsForm';
import { DefinedContributionPot } from 'types/pensions/pensions';
import {
  ADD_PENSION_ID,
  potCurrentValueId,
  potNameId,
  potRemoveId,
} from 'utils/pensionFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { Details } from '@maps-react/common/components/Details';
import { Errors } from '@maps-react/common/components/Errors/Errors';
import { Heading } from '@maps-react/common/components/Heading/Heading';
import { ListElement } from '@maps-react/common/components/ListElement';
import { NotificationBox } from '@maps-react/common/components/NotificationBox';
import { Paragraph } from '@maps-react/common/components/Paragraph';
import { AffixInput } from '@maps-react/form/components/AffixInput';
import { TextInput } from '@maps-react/form/components/TextInput';

import { PotContributions } from '../PotContributions';

export const PotDetails = ({
  copy,
  pensionPotsCopyData,
  data,
  errors,
  handleAdd,
  handleRemove,
  updatePot,
}: ReturnType<typeof usePensionsForm>) => (
  <>
    {data.pots.map((pot, index) => {
      const error = errors[potCurrentValueId(index)]?.[0];

      return (
        <section
          key={potNameId(index)}
          className="space-y-4 pb-4 border-b border-gray-300 mb-4"
        >
          <h2 className="text-2xl font-medium">
            {copy.pension} {index + 1}
          </h2>
          <TextInput
            id={potNameId(index)}
            name={potNameId(index)}
            label={copy.pensionName}
            hint={copy.pensionNameHint}
            hintClassName={'max-w-72'}
            value={pot.name}
            onChange={(event) => updatePot(index, 'name', event.target.value)}
            className="w-full max-w-lg border-gray-650"
          />

          <Errors errors={error ? [error] : []}>
            <AffixInput
              id={potCurrentValueId(index)}
              name={copy.currentValue}
              label={copy.currentValue}
              hint={copy.currentValueHint}
              value={(pot as DefinedContributionPot).currentValue}
              onChange={(event) =>
                updatePot(index, 'currentValue', event.target.value)
              }
              variant={'money'}
              className="max-w-lg border-gray-650 pb-0"
              inputFlexClassName="block"
              hasError={!!error}
              error={error}
            />
            <Details title={copy.findValue} className="pt-2">
              <Paragraph className="max-w-80 mb-0">
                {copy.findValueGuidance}
              </Paragraph>
            </Details>
          </Errors>

          <PotContributions
            index={index}
            pot={pot as DefinedContributionPot}
            errors={errors}
            updatePot={updatePot}
            copy={pensionPotsCopyData}
          />

          {index > 0 && (
            <Button
              key={potRemoveId(index)}
              variant="link"
              id={potRemoveId(index)}
              formAction={`${PENSIONS_API}?step=details&action=remove&index=${index}`}
              onClick={(event) => handleRemove(event, index)}
              className="ml-4"
            >
              {copy.removePension}
            </Button>
          )}
        </section>
      );
    })}

    <Button
      key={ADD_PENSION_ID}
      variant="secondary"
      id={ADD_PENSION_ID}
      formAction={`${PENSIONS_API}?step=details&action=add`}
      onClick={handleAdd}
      className="mb-4"
    >
      {copy.addPension}
    </Button>

    <NotificationBox className="mb-16">
      <Heading className="mb-2  font-medium" level={'h3'}>
        {copy.taxFreeCashCallout}
      </Heading>
      <Paragraph>{copy.taxFreeCashGuidance}</Paragraph>
      <Paragraph>{copy.taxFreeCashGuidanceListTitle}</Paragraph>
      <ListElement
        variant="unordered"
        color="dark"
        items={[
          copy.taxFreeCashGuidanceBulletOne,
          copy.taxFreeCashGuidanceBulletTwo,
        ]}
        className="pb-4 pl-4 pr-8 list-inside"
      />
      <Paragraph>{copy.taxFreeCashScheme}</Paragraph>
    </NotificationBox>
  </>
);
