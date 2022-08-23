import React = require('react');
import { suspend } from 'suspend-react';
import { leftjoin, loadNotionDB } from '../data';
import { createTTSLayout, el, Pages, PnP8654 } from '../layout';
import './volleyball.less';

export function VolleyballTTS() {
  const cards = useVolleyballCardsWithBack();

  return (
    <Pages layout={TTS} item={VolleyballCard} group={12} content={cards} />
  );
}
const TTS = createTTSLayout(6, 2, 56, 88);

export function VolleyballPnP() {
  const cards = useVolleyballCards();

  return (
    <Pages layout={PnP8654} item={VolleyballCard} group={5} content={cards} />
  );
}

function VolleyballCard(props: { item: any }) {
  const { item } = props;
  if (item.variant === 'play') {
    return <PlayCard {...item} />;
  } else if (item.variant === 'summary') {
    return <SummaryCard {...item} />;
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
        <Field code={props.Catches} all />
      </Layer>
      <Layer className="name">
        <Text>{props.Name}</Text>
      </Layer>
    </Frame>
  );
}

function SummaryCard(props: any) {
  if (props.side !== 'back') {
    return (
      <Frame>
        <Layer>
          <Illust src={props.Illustration} />
        </Layer>

        <Layer className="name">
          <Text>{props.Name}</Text>
        </Layer>
      </Frame>
    );
  }

  const summary = props.summary;
  const hints = Object.keys(summary).map((key) => {
    const [_, f, p, d] = key.match(/(\w)-(\d)-(\d)/);
    const n = summary[key];
    return (
      <Layer key={key} className={`summary field-${f} pos-${p} class-${d}`}>
        <Text>{n}</Text>
      </Layer>
    );
  });
  return (
    <Frame>
      {hints}
      <Layer className="name">
        <Text>{props.Name}</Text>
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
      <FieldBallGroup className={`ballgroup-${props.code}`}>
        {all.map((c) => (
          <FieldBall code={c} key={c} />
        ))}
      </FieldBallGroup>
    );
  }
}

const Frame = el('div', 'volleyball');
const Layer = el('div', 'layer');
const Text = el('p', 'text');
const Illust = el('img', 'illust');
const FieldSvg = el('svg', 'playfield');
const FieldBallGroup = el('g', 'ballgroup');
const FieldBallSvg = el('circle', 'ball');

function useVolleyballCards() {
  return suspend(loadVolleyballCards, []);
}

function useVolleyballCardsWithBack() {
  const cards = useVolleyballCards();
  return React.useMemo(() => {
    const summaries = cards.filter((one) => one.variant === 'summary');
    const data = [
      ...cards,
      ...summaries
        .map((one) => {
          return [
            { ...one, side: 'back' },
            { ...one, variant: 'play', side: 'back' },
          ];
        })
        .flat(),
    ];
    sort(data);
    return data;
  }, [cards]);
}

async function loadVolleyballCards() {
  const cards = await loadNotionDB(
    'https://nine-newsprint-c9d.notion.site/c76abae545e04b09aed98e5c7ac9aba6?v=3f03e3dc31cd440b972f937f56e000f6'
  );
  const extra = await loadNotionDB(
    'https://nine-newsprint-c9d.notion.site/248a1ac98aa04b7695a2aaa9eb1e0af3?v=868764bf9803459caaff16184a2777da'
  );

  for (const card of cards) {
    if (card.variant !== 'summary') continue;

    const hits = {} as { [key: string]: number };
    for (const other of cards) {
      if (other.variant !== 'play' || other.Name !== card.Name) continue;

      for (let i = 0; i < 12; i++) {
        const d = `${1 + Math.floor(i / 4)}`;
        const p = i % 4;

        let key = `h-${p}-${d}`;
        hits[key] = hits[key] || 0;
        if (other.Hits[p] === d) {
          hits[key]++;
        }

        key = `c-${p}-${d}`;
        hits[key] = hits[key] || 0;
        if (other.Catches[p] === d) {
          hits[key]++;
        }
      }
      card.summary = hits as any;
    }
  }

  const data = leftjoin('', cards, extra);
  sort(data);
  return data;
}

function sort(data: any[]) {
  data.sort((a, b) => {
    if (a.Name !== b.Name) return a.Name.localeCompare(b.Name);
    return a.variant.localeCompare(b.variant);
  });
}
