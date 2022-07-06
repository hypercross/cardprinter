import React = require('react');
import { ItemRenderer } from './pager';

const lt = 0.3;
function HLine(props: { y: number }) {
  return (
    <rect x="0mm" y={props.y - lt / 2 + 'mm'} width="100%" height={lt + 'mm'} />
  );
}
function VLine(props: { x: number; t: number }) {
  return (
    <rect y="0mm" x={props.x - lt / 2 + 'mm'} height="100%" width={lt + 'mm'} />
  );
}
function Cross(props: { x: number; y: number }) {
  return (
    <circle
      fill="none"
      strokeWidth="0.1mm"
      stroke="black"
      r="2mm"
      cx={props.x + 'mm'}
      cy={props.y + 'mm'}
    />
  );
}
export function PnP8654<T>(props: { content: T[]; item: ItemRenderer<T> }) {
  const Item = props.item;

  const lw = 56;
  const lh = 88;
  const py = 4;
  const a = new URL(location.href).searchParams.get('rotate') || '0';

  return (
    <svg className="pnp8654" width="297mm" height="210mm">
      <g transform={`rotate(${a}, 600, 400 )`}>
        <Cross x={297 / 2 - 2.5 * lw} y={210 / 2 - py - lh} />
        <Cross x={297 / 2 - 2.5 * lw} y={210 / 2 + py + lh} />
        <Cross x={297 / 2 + 2.5 * lw} y={210 / 2 - py - lh} />
        <Cross x={297 / 2 + 2.5 * lw} y={210 / 2 + py + lh} />

        <HLine y={210 / 2 - py - lh} />
        <HLine y={210 / 2 - py} />
        <HLine y={210 / 2} />
        <HLine y={210 / 2 + py} />
        <HLine y={210 / 2 + py + lh} />

        <VLine x={297 / 2 - 2.5 * lw} />
        <VLine x={297 / 2 - 1.5 * lw} />
        <VLine x={297 / 2 - 0.5 * lw} />
        <VLine x={297 / 2 + 0.5 * lw} />
        <VLine x={297 / 2 + 1.5 * lw} />
        <VLine x={297 / 2 + 2.5 * lw} />

        {props.content.map((item, i) => (
          <foreignObject
            className="card front"
            x={(i - 2.5) * lw + 297 / 2 + 'mm'}
            y={210 / 2 - lh - py + 'mm'}
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
      </g>
    </svg>
  );
}
