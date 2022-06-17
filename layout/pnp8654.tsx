import React = require('react');
import { ItemRenderer } from './pager';

export function PnP8654<T>(props: { content: T[]; item: ItemRenderer<T> }) {
  const Item = props.item;
  const lw = 56;
  const lh = 88;
  const py = 4;
  return (
    <svg className="pnp8654" width="297mm" height="210mm">
      {[-1, 0, 1].map((y) => (
        <rect
          key={y}
          x="0mm"
          y={y * (lh + py) + 210 / 2 + 'mm'}
          width="100%"
          height="2mm"
        />
      ))}
      <rect
        key="m1"
        x="0mm"
        y={py + 210 / 2 + 'mm'}
        width="100%"
        height="2mm"
      />
      <rect
        key="m2"
        x="0mm"
        y={-py + 210 / 2 + 'mm'}
        width="100%"
        height="2mm"
      />

      {props.content.map((item, i) => (
        <foreignObject
          className="card front"
          x={(i - 2.5) * lw + 297 / 2 + 1 + 'mm'}
          y={210 / 2 - lh - py + 1 + 'mm'}
          width={lw + 'mm'}
          height={lh + 'mm'}
          key={i}
        >
          <Item item={item} variant="front" />
        </foreignObject>
      ))}

      {props.content.map((item, i) => (
        <foreignObject
          className="card back"
          x={(i - 2.5) * lw + 297 / 2 + 1 + 'mm'}
          y={210 / 2 + py + 1 + 'mm'}
          width={lw + 'mm'}
          height={lh + 'mm'}
          key={'back' + i}
        >
          <Item item={item} variant="back" />
        </foreignObject>
      ))}

      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x) => (
        <rect
          key={x}
          x={x * lw + 297 / 2 + 0.9 + 'mm'}
          y="0mm"
          width="0.2mm"
          height="210mm"
        />
      ))}
    </svg>
  );
}
