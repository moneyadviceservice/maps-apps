import { NextPage } from 'next';

import { BasePageLayout } from 'components/BasePageLayout';

import { Heading } from '@maps-react/common/components/Heading';
import { Paragraph } from '@maps-react/common/components/Paragraph';

import { DataSourceRadio } from '../components/DataSourceRadio';
import { getScenarios, mapAndSortBackEndTestScenarios } from '../utils/api';

type Props = {
  searchParams: Promise<{
    redirect_uri: string;
  }>;
};

type DataSource = {
  displayValue: string;
  requestValue: string;
};

const Page: NextPage<Props> = async (props) => {
  const searchParams = await props.searchParams;

  const { redirect_uri } = searchParams;

  let scenariosComposerDev: DataSource[] = [];
  let scenariosComposerTest: DataSource[] = [];
  let scenariosComposerStaging: DataSource[] = [];
  let backEndError = '';

  try {
    //* Fetch all test scenarios from the composer databases
    const { data: composerDev, error } = await getScenarios();
    const { data: composerTest, error: errorTest } = await getScenarios('test');
    const { data: composerStaging, error: errorStaging } = await getScenarios(
      'staging',
    );
    backEndError = error || errorTest || errorStaging || '';

    //* Extract and sort the testScenarioCode from each test scenario
    scenariosComposerDev = mapAndSortBackEndTestScenarios(composerDev);
    scenariosComposerTest = mapAndSortBackEndTestScenarios(composerTest);
    scenariosComposerStaging = mapAndSortBackEndTestScenarios(composerStaging);
  } catch (error) {
    console.error('Error fetching test scenarios from the database:', error);
  }
  const redirect = /^https?:\/\//i.test(redirect_uri)
    ? redirect_uri
    : `https://${redirect_uri}`;

  return (
    <BasePageLayout title="CDA Emulator">
      {redirect_uri ? (
        <div className="lg:w-2/3">
          <div className="flex flex-col w-full">
            <DataSourceRadio
              redirect={redirect}
              scenariosComposerDev={scenariosComposerDev}
              scenariosComposerTest={scenariosComposerTest}
              scenariosComposerStaging={scenariosComposerStaging}
              backEndError={backEndError}
            />
          </div>
        </div>
      ) : (
        <div className="mb-24">
          <Heading level="h4" className="text-red-700">
            ⚠️ Error
          </Heading>
          <Paragraph className="mt-4">
            The query parameter{' '}
            <code className="p-1 text-sm text-black bg-gray-100 rounded-sm">
              redirect_uri
            </code>{' '}
            was not not provided.
          </Paragraph>
        </div>
      )}
    </BasePageLayout>
  );
};

export default Page;
