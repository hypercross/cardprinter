import React = require('react');
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { suspend } from 'suspend-react';
import { leftjoin, loadNotionDB, repeat } from '../data';
import { Pages, LayoutRenderer, CurvedText } from '../layout';
import './groupbuy.less';

export function GroupBuy(props: {
  layout: LayoutRenderer<any>;
  group: number;
  withBacks?: boolean;
}) {
  const data = suspend(
    async function () {
      let data: any[] = await loadNotionDB(
        'https://www.notion.so/4eaa022bef9e4812a8a46b1ef060ca2a'
      );
      data = leftjoin(
        '',
        data,
        await loadNotionDB(
          'https://www.notion.so/84f52ac54fdc45a89ac59058b10075e5'
        )
      );
      data = leftjoin(
        '品类',
        data,
        await loadNotionDB(
          'https://www.notion.so/9ea7aa6339c540748efc5da1129c99da'
        )
      );
      data = repeat(data as any, '张数');
      return data;
    },
    ['gbuy']
  );

  return <Pages item={Card} content={data} {...props} />;
}

function Card(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return (
      <div className="card-frame gbuy">
        <div className="card-layer prop-卡背">
          <img src={props.item.卡背} style={{ transform: 'rotate(180deg)' }} />
        </div>
      </div>
    );
  }

  return <CardFront {...props.item} />;
}

function CardFront(props: any) {
  return (
    <div className="card-frame gbuy">
      <div className="card-layer prop-背景">
        <img src={props.背景} />
      </div>

      <div className="card-layer prop-标题数字图">
        <img src={props.标题数字图} />
      </div>

      <div className="card-layer prop-品类符号">
        <img src={props.品类符号} />
      </div>

      <div className="card-layer prop-图">
        <img src={props['图']} />
      </div>

      <div className="card-layer prop-名称">
        <CurvedText text={props.名称} />
      </div>

      <div className="card-layer prop-心动数">
        <span>{props['心动数']}</span>
      </div>

      <div className="card-layer prop-效果背景">
        <img src={props.效果背景} />
      </div>

      <div className="card-layer prop-特殊效果">
        <ReactMarkdown>{props['特殊效果']}</ReactMarkdown>
      </div>
    </div>
  );
}
