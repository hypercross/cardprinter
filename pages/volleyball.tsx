import React = require('react');
import { suspend } from 'suspend-react';
import { leftjoin, loadNotionDB } from '../data';
import { el, Pages, PnP8654 } from '../layout';
import './volleyball.less';

export function VolleyballPnp() {
  const cards = useVolleyballCards();

  return (
    <Pages layout={PnP8654} item={VolleyballCard} group={5} content={cards} />
  );
}

function VolleyballCard(props: { item: any }) {
  const { item } = props;
  if (item.variant === 'play') {
    return <PlayCard {...item} />;
  }
  return null;
}

function PlayCard(props: any) {
  if (props.side === 'back') {
    return (
      <Frame>
        <Layer>
          <Illust src={props.BackIllust} />
        </Layer>
      </Frame>
    );
  }
  return (
    <Frame>
      <Layer className="illustration">
        <Illust src={props.Illustration} />
      </Layer>
      <Layer className="hits">
        <Field code={props.Hits} />
      </Layer>
      <Layer className="catches">
        <Field code={props.Catches} />
      </Layer>
    </Frame>
  );
}

function Field(props: { code: string; all?: boolean }) {
  const balls = [0, 1, 2, 3].map((i) => props.code[i]);
  return (
    <FieldSvg>
      {balls.map((c, i) => (
        <FieldBall code={c} key={i} all={props.all} />
      ))}
    </FieldSvg>
  );
}

function FieldBall(props: { code: string; all?: boolean }) {
  const className = `class-${props.code}`;
  if (!props.all) {
    return <FieldBallSvg className={className} />;
  } else {
    const all = [];
    for (let c = 0; `${c}` <= props.code; c++) {
      all.push(c);
    }
    return (
      <FieldBallGroup>
        {all.map((c) => (
          <FieldBall code={c} key={c} />
        ))}
      </FieldBallGroup>
    );
  }
}

const Frame = el('div', 'volleyball');
const Layer = el('div', 'layer');
const Illust = el('img', 'illust');
const FieldSvg = el('svg', 'playfield');
const FieldBallGroup = el('g', 'ballgroup');
const FieldBallSvg = el('circle', 'ball');

function useVolleyballCards() {
  return suspend(loadVolleyballCards, []);
}

async function loadVolleyballCards() {
  const cards = await loadNotionDB(
    'https://nine-newsprint-c9d.notion.site/c76abae545e04b09aed98e5c7ac9aba6?v=3f03e3dc31cd440b972f937f56e000f6'
  );
  const extra = await loadNotionDB(
    'https://nine-newsprint-c9d.notion.site/248a1ac98aa04b7695a2aaa9eb1e0af3?v=868764bf9803459caaff16184a2777da'
  );

  const data = leftjoin('', cards, extra);
  return data;
}
