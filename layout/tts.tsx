import React = require('react');
import { groupBy } from '../data/group';
import { ItemRenderer } from './pager';

export function createTTSLayout(
  cols: number,
  rows: number,
  width: number,
  height: number
) {
  return function ttsLayout<T extends { variant?: string }>(props: {
    content: T[];
    item: ItemRenderer<T>;
  }) {
    const Item = props.item;
    const ref = React.useRef<SVGSVGElement>(null);
    const download = React.useCallback(() => downloadSvg(ref.current), [ref]);
    return (
      <React.Fragment>
        {/* <button onClick={download}>下载svg</button>
        <br /> */}
        <svg
          ref={ref}
          width={width * cols + 'mm'}
          height={height * rows + 'mm'}
        >
          {groupBy(props.content, cols).map((row, y) => {
            return row.map((item, x) => {
              return (
                <foreignObject
                  key={`${x}-${y}`}
                  width={width + 'mm'}
                  height={height + 'mm'}
                  x={x * width + 'mm'}
                  y={y * height + 'mm'}
                >
                  <Item item={item} variant={item.variant} />
                </foreignObject>
              );
            });
          })}
        </svg>
      </React.Fragment>
    );
  };
}

async function downloadSvg(svg: SVGSVGElement) {
  svg = svg.cloneNode(true) as typeof svg;

  const defs = document.createElement('defs');
  svg.appendChild(defs);
  const styles = [...document.head.querySelectorAll('style')];
  for (const style of styles) defs.appendChild(style.cloneNode(true));

  const xml = new XMLSerializer().serializeToString(svg);
  const datauri = 'data:image/svg+xml,' + encodeURIComponent(xml);
  // downloadURI(datauri, 'cardsheet.svg');
  // return;

  const img = new Image();
  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.src = datauri;
  });

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth * 2;
  canvas.height = img.naturalHeight * 2;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const webp = canvas.toDataURL('image/webp');
  downloadURI(webp, 'cardsheet.webp');
}

function downloadURI(uri: string, name: string) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
