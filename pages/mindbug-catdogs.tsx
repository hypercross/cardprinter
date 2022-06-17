import React = require('react');
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { suspend } from 'suspend-react';
import { leftjoin, loadNotionDB, repeat } from '../data';
import { unique } from '../data/unique';
import { Pages, LayoutRenderer } from '../layout';
import './mindbug-catdogs.less';

export function MindbugCatdogs(props: {
  layout: LayoutRenderer<any>;
  group: number;
  withBacks?: boolean;
}) {
  const data = suspend(
    async function () {
      const db1 = await loadNotionDB(
        'https://www.notion.so/7dfcaf1ca6a948c4a53d4391b65ef10d'
      );
      const db2 = await loadNotionDB(
        'https://www.notion.so/48cded414fa741589aec6149719b7904'
      );
      const joined = leftjoin('', db1, db2);
      const repeated = repeat(joined as any, '张数');
      const extended = props.withBacks
        ? [
            ...repeated,
            ...unique(repeated as any, '卡背').map((one) => ({
              ...one,
              variant: 'back',
            })),
          ]
        : repeated;
      return extended;
    },
    ['mfgc', props.withBacks]
  );

  return <Pages item={Card} content={data} {...props} />;
}

function Card(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return (
      <div className="card-frame">
        <div className="card-layer">
          <img src={props.item.卡背} style={{ transform: 'rotate(180deg)' }} />
        </div>
      </div>
    );
  }

  return <CardFront {...props.item} />;
}

function CardFront(props: any) {
  return (
    <div
      className="card-frame"
      style={{ backgroundImage: `url(${props['底图']})` }}
    >
      <div className="card-layer prop-印象图">
        <img src={props['印象图']} />
      </div>

      <div
        className="card-layer prop-妃位官位"
        style={{ backgroundImage: `url(${props['标题图']})` }}
      >
        {props['妃位官位']}
      </div>

      <div className="card-layer prop-等级">
        <span>{props['等级']}</span>
      </div>

      <div className="card-layer prop-效果">
        <ReactMarkdown>{props['效果']}</ReactMarkdown>
      </div>

      <div className="card-layer prop-风味文字">{props['风味文字']}</div>
    </div>
  );
}
