export function groupBy<T>(source: T[], by: number) {
  const groups = [] as T[][];
  for (let i = 0; i < source.length; i += by) {
    groups.push(source.slice(i, i + by));
  }
  return groups;
}
