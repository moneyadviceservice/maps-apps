import { GetServerSideProps, NextPage } from 'next';

import { Heading } from '@maps-react/common/components/Heading';
import { Container } from '@maps-react/core/components/Container';
import { ToolPageLayout } from '@maps-react/layouts/ToolPageLayout';

interface EnvVarsPageProps {
  envVars: Record<string, string>;
}

const EnvVarsPage: NextPage<EnvVarsPageProps> = ({ envVars }) => {
  const sortedEnvVars = Object.entries(envVars).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <ToolPageLayout pageTitle="Environment Variables - MoneyHelper">
      <Container>
        <div className="space-y-8">
          <Heading level="h1" className="text-blue-700">
            Environment Variables
          </Heading>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-4">
              Total environment variables: {sortedEnvVars.length}
            </p>

            <div className="space-y-2">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variable Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedEnvVars.map(([key, value]) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {key}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 break-all">
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          {value}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Container>
    </ToolPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  EnvVarsPageProps
> = async () => {
  // Only show specific environment variables
  const filteredEnvVars: Record<string, string> = {};
  const allowedPrefixes = ['NEXT_PUBLIC', 'NETLIFY_', 'npm_'];

  for (const [key, value] of Object.entries(process.env)) {
    const isAllowed = allowedPrefixes.some((prefix) => key.startsWith(prefix));

    if (isAllowed && value) {
      filteredEnvVars[key] = value;
    }
  }

  return {
    props: {
      envVars: filteredEnvVars,
    },
  };
};

export default EnvVarsPage;
