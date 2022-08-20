import React = require('react');
import { suspend } from 'suspend-react';
import { loadCSV, loadNotionDB } from '../data';
import './noodle-realms.less';
import { createTTSLayout, Pages, PnP8654, Single6393 } from '../layout';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { leftjoin } from '../data/leftjoin';

export function NoodleRealmPDF() {
  const cards = useNoodleRealmCards('food', 'fridge');
  return (
    <Pages
      layout={Single6393}
      item={NoodleRealmCard}
      content={cards}
      group={1}
    />
  );
}

export function NoodleRealmCards() {
  const cards = useNoodleRealmCards('food', 'fridge');
  return (
    <Pages
      layout={createTTSLayout(8, 8, 56, 88)}
      item={NoodleRealmCard}
      content={cards}
      group={64}
    />
  );
}

export function NoodleRealmPnP豆腐节() {
  const card = useNoodleRealmCards().find((one) => one.名称 === '豆腐结');
  return (
    <Pages
      layout={PnP8654}
      group={5}
      content={[card, card, card, card, card]}
      item={NoodleRealmCard}
    />
  );
}

export function NoodleRealmPnP() {
  return (
    <Pages
      layout={PnP8654}
      group={5}
      content={useNoodleRealmCards()}
      item={NoodleRealmCard}
    />
  );
}

function useNoodleRealmCards(...variants: string[]) {
  return suspend(
    async function () {
      // 食材
      let data: any[] = await loadCSV(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuzbtPBap-36-EE9lHVTiX00CdPRR8sw8KIRIM-NSRO_b-ILcTePEAUlQbevbDENjc-0GWqn-Gv84q/pub?gid=973703346&single=true&output=csv'
      );

      data.forEach((item) => {
        item.variant = 'food';
        item.类型 = item.主类型;
        item.子类型 = item.副类型;
        item.加分 = item.加成分;
        item.加成条件 = [item.加成, item.加成2, item.加成3]
          .map((one) => one.trim())
          .filter((one) => !!one);
      });

      // 卡图
      data = leftjoin(
        '名称',
        data,
        await loadNotionDB(
          'https://nine-newsprint-c9d.notion.site/4ef514e1de6c43f7a270db8a42793167?v=31b92726e0c54c48b8866e2ffe77964e'
        )
      );

      // 冰箱
      const fridges = await loadNotionDB(
        'https://nine-newsprint-c9d.notion.site/2c74cfe7184046849a1bb0dc6ca0922d?v=18eea13a2440466e96f96e5a1d06c693'
      );
      fridges.forEach((one) => {
        one.variant = 'fridge';
        one.rule = data[0].rule;
      });
      data.push(...fridges);

      //角色
      const chars = await loadNotionDB(
        'https://www.notion.so/629317e82ce846f5b54dff91c3a57a75?v=de645cc6a56843c7ab30b22a1b9b3036'
      );
      chars.forEach((char) => {
        char.variant = 'char';
      });
      data.push(...chars);

      // 附加
      data = leftjoin(
        '',
        data,
        await loadNotionDB(
          'https://www.notion.so/a1b9af84f3d9473d884cd2f415d5bffb'
        )
      );

      data.push(
        ...variants.map((variant) => ({ ...data[0], variant, side: 'back' }))
      );

      return data;
    },
    ['noodlerealms', ...variants]
  );
}

function NoodleRealmCard(props: { item: any }) {
  const variant = props.item.variant;
  const side = props.item.side;
  if (variant === 'food') {
    if (side === 'back') {
      return <CardBack {...props} />;
    } else {
      return <CardFront {...props} />;
    }
  } else if (variant === 'fridge') {
    if (side === 'back') {
      return <CardRule {...props} />;
    } else {
      return <CardFridge {...props} />;
    }
  } else if (variant === 'char') {
    if (side === 'back') {
      return <CardBack {...props} backkey="角色卡背" />;
    } else {
      return <CardChar {...props} />;
    }
  }
  return null;
}
function CardFront(props: { item: any }) {
  let template = '';
  if (props.item.类型 === '面条') {
    template = '可与$1搭配';
  } else if (props.item.类型 === '调味') {
    template = '可与$1搭配';
  } else {
    template = '可与$1搭配';
  }
  const explain = template
    .replace('$1', '**' + props.item.加成条件.join(', ') + '**')
    .replace('$2', props.item.加分);
  return (
    <div
      className={`noodle-realm-frame ${props.item.子类型} ${props.item.类型} `}
    >
      <div className="frame padded">
        <img src={props.item.卡框} />
      </div>
      <div className="frame padded">
        <img src={props.item.高亮} />
      </div>
      <div className="frame padded">
        <img src={props.item.插图 || props.item.问号} />
      </div>
      <div className={`name chars-${props.item.名称.length}`}>
        {props.item.名称}
      </div>
      <div className="type">
        {props.item.类型} {props.item.子类型}
      </div>
      <div className="score">{props.item.基本分}</div>
      <div className="explain">
        <ReactMarkdown>{explain}</ReactMarkdown>
      </div>
      <div className="bonus">
        {props.item.加成条件.map((extra) => (
          <div key={extra}>+{extra}</div>
        ))}
      </div>
      <div className="frame multiply">
        <img src={props.item.卡面滤镜} />
      </div>
    </div>
  );
}
function CardBack(props: { item: any; backkey?: string }) {
  // console.log(props.item);
  return (
    <div className={`noodle-realm-frame ${props.item.variant}`}>
      <div className="frame padded">
        <img
          src={props.item[props.backkey || '卡背']}
          crossOrigin="anonymous"
        />
      </div>

      <div className="frame multiply">
        <img src={props.item.卡背背景} />
      </div>
    </div>
  );
}
function CardRule(props: { item: any }) {
  // console.log(props.item);
  return (
    <div className={`noodle-realm-frame ${props.item.variant}`}>
      <div className="frame padded">
        <img src={props.item.rule} crossOrigin="anonymous" />
      </div>

      <div className="frame multiply">
        <img src={props.item.卡面滤镜} />
      </div>
    </div>
  );
}
function CardFridge(props: { item: any }) {
  // console.log(props.item);
  return (
    <div className={`noodle-realm-frame ${props.item.variant}`}>
      <div className="frame multiply">
        <img src={props.item.出血} />
      </div>

      <div className="frame padded">
        <img src={props.item.冰箱图} crossOrigin="anonymous" />
      </div>
    </div>
  );
}
function CardChar(props: { item: any }) {
  return (
    <div className={`noodle-realm-frame ${props.item.variant}`}>
      <div className="frame multiply">
        <img src={props.item.出血} />
      </div>

      <div className="frame padded">
        <img src={props.item.图} crossOrigin="anonymous" />
      </div>
      <div className="frame multiply">
        <img src={props.item.卡面滤镜} />
      </div>
    </div>
  );
}
