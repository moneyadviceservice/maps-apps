interface InputConfig {
  key: string;
  dataPath?: string;
}

export const buildUpdatePayloadFromInputs = (
  fields: Record<string, string | boolean>,
  inputs: InputConfig[],
  globalUpdatePath?: string,
): Record<string, string | boolean> => {
  return inputs.reduce((acc, { key, dataPath }) => {
    const rawValue = fields[key];
    const value = rawValue ?? '';

    let path = key;

    if (dataPath) {
      path = `${dataPath}/${key}`;
    } else if (globalUpdatePath) {
      path = `${globalUpdatePath}/${key}`;
    }

    acc[path] = value;
    return acc;
  }, {} as Record<string, string | boolean>);
};
