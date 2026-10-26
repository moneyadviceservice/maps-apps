/** Groups an array of objects by a property name. */
export default function groupBy(name: string) {
  return (
    carry: { [key: string]: unknown[] },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { [name]: group, ...tab }: any,
  ) => ({
    ...carry,
    [group]: [...(carry[group] || []), tab],
  });
}
