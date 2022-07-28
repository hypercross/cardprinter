import React = require('react');
import { suspend } from 'suspend-react';
import { loadCSV, loadNotionDB } from '../data';
import './noodle-realms.less';
import { createTTSLayout, Pages, PnP8654, Single6393 } from '../layout';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { leftjoin } from '../data/leftjoin';

export function NoodleRealmPDF() {
  const cards = useNoodleRealmCards('ttsback', 'rule');
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
  const cards = useNoodleRealmCards('ttsback');
  return (
    <Pages
      layout={createTTSLayout(8, 7, 56, 88)}
      item={NoodleRealmCard}
      content={cards}
      group={56}
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
  // return suspend(
  //   async function () {
  //     let data: any[] = await loadNotionDB(
  //       'https://www.notion.so/925100d0fbd344a7bedfde10b26df87a'
  //     );
  //     return data;
  //   },
  //   ['noodlerealm']
  // );
  return suspend(
    async function () {
      let data: any[] = await loadCSV(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuzbtPBap-36-EE9lHVTiX00CdPRR8sw8KIRIM-NSRO_b-ILcTePEAUlQbevbDENjc-0GWqn-Gv84q/pub?gid=973703346&single=true&output=csv'
      );
      data = leftjoin(
        '',
        data,
        await loadNotionDB(
          'https://www.notion.so/a1b9af84f3d9473d884cd2f415d5bffb'
        )
      );
      data = leftjoin(
        '名称',
        data,
        await loadNotionDB(
          'https://nine-newsprint-c9d.notion.site/4ef514e1de6c43f7a270db8a42793167?v=31b92726e0c54c48b8866e2ffe77964e'
        )
      );
      data.forEach((item) => {
        item.类型 = item.主类型;
        item.子类型 = item.副类型;
        item.加分 = item.加成分;
        item.加成条件 = [item.加成, item.加成2, item.加成3]
          .map((one) => one.trim())
          .filter((one) => !!one);
      });
      data.push(...variants.map((variant) => ({ ...data[0], variant })));
      if (variants.indexOf('rule') >= 0) {
        const fridges = await loadNotionDB(
          'https://nine-newsprint-c9d.notion.site/2c74cfe7184046849a1bb0dc6ca0922d?v=18eea13a2440466e96f96e5a1d06c693'
        );
        fridges.forEach((one) => {
          one.variant = 'fridge';
        });
        data.push(...fridges);
      }
      return data;
    },
    ['noodlerealms', ...variants]
  );
}

function NoodleRealmCard(props: { item: any; variant: string }) {
  if (props.variant === 'back') {
    return <CardBack {...props} />;
  } else if (props.variant === 'ttsback') {
    return <CardBack {...props} />;
  } else if (props.variant === 'rule') {
    return <CardRule {...props} />;
  } else if (props.variant === 'fridge') {
    return <CardFridge {...props} />;
  } else {
    return <CardFront {...props} />;
  }
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
function CardBack(props: { item: any }) {
  // console.log(props.item);
  return (
    <div
      className={`noodle-realm-frame back ${
        props.item.variant === 'ttsback' ? 'straight' : ''
      }`}
    >
      <div className="frame padded">
        <img src={props.item.卡背} crossOrigin="anonymous" />
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
