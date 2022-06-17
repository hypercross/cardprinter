export function unique<
  K extends string,
  T extends { [key in K]: number | string }
>(items: T[], key: K) {
  const map = {} as { [key: string]: T };
  for (const one of items) {
    if (map[one[key]]) continue;
    map[one[key]] = one;
  }
  return Object.keys(map).map((key) => map[key]);
}
