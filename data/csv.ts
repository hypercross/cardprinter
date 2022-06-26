export async function loadCSV(url: string) {
  const res = await fetch(url);
  const txt = await res.text();
  const lines = txt.split('\n');
  const cells = lines.map((line) => line.split(','));

  const header = cells[0];
  const items = cells.slice(1);
  const data = items.map((item) => {
    const obj = {} as any;
    for (let i = 0; i < item.length; i++) {
      obj[header[i]] = item[i];
    }
    return obj;
  });

  return data;
}
