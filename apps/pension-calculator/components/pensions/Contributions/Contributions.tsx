import { frequencyOptions } from 'data/your-income';
import { usePensionsForm } from 'hooks/usePensionsForm';
import { contributionFieldId } from 'utils/pensionFieldIds';

import { Details } from '@maps-react/common/components/Details';
import { useTranslation } from '@maps-react/hooks/useTranslation';

import { Contribution } from '../Contribution';
import { MoneyField } from '../MoneyField';

export const Contributions = ({
  copy,
  data,
  errors,
  setData,
}: ReturnType<typeof usePensionsForm>) => {
  const { z } = useTranslation();
  const options = frequencyOptions(z);
  return (
    <>
      <Contribution
        kind="employee"
        label={copy.employeeContribution}
        data={data}
        error={errors[contributionFieldId('employee', 'value')]?.[0]}
        copy={copy}
        options={options}
        setData={setData}
      />
      <Contribution
        kind="employer"
        label={copy.employerContribution}
        data={data}
        error={errors[contributionFieldId('employer', 'value')]?.[0]}
        copy={copy}
        options={options}
        setData={setData}
      />
      <MoneyField
        id="annualManagementCharge"
        label={copy.annualManagementCharge}
        value={data.annualManagementCharge}
        onChange={(annualManagementCharge) =>
          setData((current) => ({ ...current, annualManagementCharge }))
        }
      />
      <Details title={copy.feeGuidanceTitle}>
        <p>{copy.feeGuidance}</p>
      </Details>
    </>
  );
};
