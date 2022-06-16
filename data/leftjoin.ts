export function leftjoin<
  K extends string,
  T1 extends { [key in K]: any },
  T2 extends { [key in K]: any }
>(key: string, t1: T1[], t2: T2[]) {
  const map = {} as { [key: string]: T2 };
  for (const one of t2) {
    map[one[key]] = one;
  }

  return t1.map((one) => {
    return {
      ...one,
      ...map[one[key]],
    };
  });
}
