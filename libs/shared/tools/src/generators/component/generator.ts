import { formatFiles, generateFiles, names, Tree } from '@nx/devkit';

import { ComponentGeneratorSchema } from './schema';

export default async function (
  host: Tree,
  { name, targetPath }: ComponentGeneratorSchema,
) {
  // defaults
  name = name || 'TestComponent';
  targetPath = targetPath || 'libs/shared/ui/src/components';

  // paths & options
  const templates = `libs/shared/tools/src/generators/component/files`;
  const path = `${targetPath}/${name}`;
  const options = {
    ...names(name),
    fileName: name,
  };

  // generate the files
  generateFiles(host, templates, path, {
    tmpl: '',
    ...options,
  });

  await formatFiles(host);
}
