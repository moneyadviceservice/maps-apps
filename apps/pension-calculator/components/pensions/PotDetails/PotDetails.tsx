import { PENSIONS_API, usePensionsForm } from 'hooks/usePensionsForm';
import {
  ADD_PENSION_ID,
  potCurrentValueId,
  potNameId,
  potRemoveId,
  potTaxFreeCashId,
} from 'utils/pensionFieldIds';

import { Button } from '@maps-react/common/components/Button';
import { Details } from '@maps-react/common/components/Details';
import { NotificationBox } from '@maps-react/common/components/NotificationBox';
import { TextInput } from '@maps-react/form/components/TextInput';

import { MoneyField } from '../MoneyField';

export const PotDetails = ({
  copy,
  data,
  errors,
  handleAdd,
  handleRemove,
  updatePot,
}: ReturnType<typeof usePensionsForm>) => (
  <>
    {data.pots.map((pot, index) => (
      <section
        key={potNameId(index)}
        className="space-y-4 border-b border-gray-300 pb-6"
      >
        <h2 className="text-2xl font-medium">
          {copy.pension} {index + 1}
        </h2>
        <label className="block text-xl" htmlFor={potNameId(index)}>
          {copy.pensionName}
        </label>
        <TextInput
          id={potNameId(index)}
          name={potNameId(index)}
          value={pot.name}
          placeholder={copy.pensionNamePlaceholder}
          onChange={(event) => updatePot(index, 'name', event.target.value)}
          className="w-full max-w-[412px]"
        />
        <MoneyField
          id={potCurrentValueId(index)}
          label={copy.currentValue}
          value={pot.currentValue}
          error={errors[potCurrentValueId(index)]?.[0]}
          onChange={(value) => updatePot(index, 'currentValue', value)}
        />
        <Details title={copy.findValue}>
          <p>{copy.findValueGuidance}</p>
        </Details>
        <MoneyField
          id={potTaxFreeCashId(index)}
          label={copy.taxFreeCash}
          value={pot.taxFreeCash}
          error={errors[potTaxFreeCashId(index)]?.[0]}
          onChange={(value) => updatePot(index, 'taxFreeCash', value)}
        />
        {index > 0 && (
          <Button
            variant="link"
            id={potRemoveId(index)}
            formAction={`${PENSIONS_API}?step=details&action=remove&index=${index}`}
            onClick={(event) => handleRemove(event, index)}
          >
            {copy.removePension}
          </Button>
        )}
      </section>
    ))}
    <NotificationBox>
      <h2 className="mb-2 text-xl font-medium">{copy.taxFreeCashCallout}</h2>
      <p>{copy.taxFreeCashGuidance}</p>
    </NotificationBox>
    <Button
      variant="secondary"
      id={ADD_PENSION_ID}
      formAction={`${PENSIONS_API}?step=details&action=add`}
      onClick={handleAdd}
    >
      + {copy.addPension}
    </Button>
  </>
);
