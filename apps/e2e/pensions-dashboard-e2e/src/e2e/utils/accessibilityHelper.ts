export async function parseViolations(violations) {
  let results = '';
  const violationsSize = violations.length;
  const separator = ' | ';
  const endline = '\n';

  if (violationsSize > 0) {
    results =
      results +
      endline +
      'Found ' +
      violationsSize +
      ' accessibility violations.' +
      endline;
    let index = 0;
    violations.forEach((element) => {
      results =
        results +
        index +
        ' - ' +
        element.id +
        separator +
        element.impact +
        separator +
        element.description +
        endline;
      index++;
    });
  }
  return results;
}
