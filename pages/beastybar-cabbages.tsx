import React = require('react');
import { suspend } from 'suspend-react';
import { leftjoin, loadNotionDB, repeat, toDataURL } from '../data';
import { unique } from '../data/unique';
import { Pages, LayoutRenderer } from '../layout';
import './beastybar-cabbages.less';
import './bcfont.css';

export function BeastybarCabbages(props: {
  layout: LayoutRenderer<any>;
  group: number;
  withBacks?: boolean;
}) {
  const data = suspend(
    async function () {
      let data = await loadNotionDB(
        'https://www.notion.so/ca93baaac53944a8a66ddb531e3eee77'
      );
      const extra = await loadNotionDB(
        'https://www.notion.so/b6f2f29b99234b7bb6cf1c739e08ce62'
      );
      data = repeat(data as any, '楼栋') as any;
      data = leftjoin('楼栋', data, extra);
      data = props.withBacks
        ? [
            ...data,
            ...unique(data as any, '颜色').map((one) => ({
              ...one,
              variant: 'back',
            })),
          ]
        : data;
      data.sort((a, b) => a.点数 - b.点数);
      return data;
    },
    ['bbcb', props.withBacks]
  );

  return <Pages item={Card} content={data} {...props} />;
}

function Card(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return (
      <div className="card-frame bbcb">
        <div
          className="card-layer prop-卡背"
          style={{ backgroundColor: props.item.颜色 }}
        >
          <img
            src={props.item.卡背}
            style={{ transform: 'rotate(180deg)' }}
            onLoad={toDataURL}
            crossOrigin="anonymous"
          />
        </div>
      </div>
    );
  }

  return <CardFront {...props.item} />;
}

function CardFront(props: any) {
  return (
    <div className="card-frame bbcb" style={{ '--color': props['颜色'] }}>
      <div className="card-layer prop-印象图">
        <img src={props['印象图']} onLoad={toDataURL} crossOrigin="anonymous" />
      </div>

      <div className="card-layer prop-名称">{props['名称']}</div>

      <div className="card-layer prop-点数">
        <span>{props['点数']}</span>
      </div>

      <div className="card-layer prop-规则文字">{props['规则文字']}</div>
      <div className="card-layer prop-符号">
        {props['符号'] && (
          <img src={props['符号']} onLoad={toDataURL} crossOrigin="anonymous" />
        )}
      </div>
    </div>
  );
}
