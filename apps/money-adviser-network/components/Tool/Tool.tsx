import { ChangeEvent, useEffect, useId, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { H2 } from '@maps-react/common/components/Heading';
import { Link } from '@maps-react/common/components/Link';
import { Select } from '@maps-react/form/components/Select';

export type ToolProps = {
  name: string;
  title: string;
  description: string;
};

export const Tool = ({ name, title, description }: ToolProps) => {
  const [language, setLanguage] = useState('en');
  const selectId = useId();

  const [origin, setOrigin] = useState('');
  useEffect(() => setOrigin(location.protocol + '//' + location.host), []);

  const languages = [
    { name: 'en', title: 'English' },
    { name: 'cy', title: 'Cymraeg' },
  ];

  return (
    <div id={name} className="p-3 space-y-4 border">
      <H2 color="text-blue-700">{title}</H2>
      <hr />
      <div className="text-lg text-gray-700">{description}</div>
      <div className="space-y-4">
        <ul>
          <li>
            <Link className="text-lg" href={`/en/${name}`}>
              English home page
            </Link>
          </li>
          <li>
            <Link className="text-lg" href={`/cy/${name}`}>
              Cymraeg home page
            </Link>
          </li>
          {languages.map((l, i) => (
            <li key={uuidv4()}>
              <Link
                className="text-lg"
                href={{
                  pathname: '/api/test-embed',
                  query: { origin, language: l.name, name },
                }}
              >
                {l.title} Example page
              </Link>
            </li>
          ))}
        </ul>
        <div className="border shadow">
          <div className="px-3 py-2 border-b">
            <div>
              <label
                htmlFor={selectId}
                className="block mb-1 text-lg font-bold text-gray-700"
              >
                1. Choose a language
              </label>
              <div className="max-w-sm">
                <Select
                  id={selectId}
                  name="language"
                  data-testid="language-select"
                  value={language}
                  hideEmptyItem
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setLanguage(e.target.value)
                  }
                  options={languages.map((l) => ({
                    text: l.title,
                    value: l.name,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
