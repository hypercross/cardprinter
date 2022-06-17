export function repeat<
  K extends string,
  T extends { [key in K]: number | string[] }
>(items: T[], key: K) {
  const output = [] as T[];
  for (const one of items) {
    const count = one[key] || 1;
    if (typeof count === 'number') {
      for (let i = 0; i < count; i++) {
        output.push(one);
      }
    } else if (Array.isArray(count)) {
      for (const val of count) {
        const now = { ...one };
        now[key] = val;
        output.push(now);
      }
    }
  }
  return output;
}
