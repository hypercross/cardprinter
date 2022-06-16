export function repeat<K extends string, T extends { [key in K]: number }>(
  items: T[],
  key: K
) {
  const output = [] as T[];
  for (const one of items) {
    const count = one[key] || 1;
    for (let i = 0; i < count; i++) {
      output.push(one);
    }
  }
  return output;
}
