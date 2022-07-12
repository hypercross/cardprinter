import { parse } from 'csv-parse/sync';
import { leftjoin } from './leftjoin';

export async function loadCSV(url: string) {
  const res = await fetch(url);
  const cells = parse(await res.text()) as string[][];

  const sections = [] as string[][][];
  let st = 0;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].join('').length) continue;
    sections.push(cells.slice(st, i));
    st = i + 1;
  }
  if (st < cells.length) sections.push(cells.slice(st));

  console.log(
    `table shape: \n${sections
      .map((sec) => sec[0].join(',') + ':' + (sec.length - 1))
      .join('\n')}`
  );

  return sections.map(csv2json).reduce((a, b) => {
    if (!a.length || !b.length) return [...a, ...b];

    const key = Object.keys(a[0]).find((key) => b[0][key] !== undefined);
    if (!key) throw new Error('table cannot be joined');

    return leftjoin(key, a, b);
  });
}

function csv2json(csv: string[][]) {
  const [header, ...items] = csv;
  return items.map((item) => {
    const obj = {} as any;
    for (let i = 0; i < item.length; i++) {
      obj[header[i]] = item[i];
    }
    return obj;
  });
}
