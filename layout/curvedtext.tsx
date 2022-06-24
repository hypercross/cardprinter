import React = require('react');
import './curvedtext.less';

export function CurvedText(props: { text: string }) {
  const { text } = props;
  if (!text) return null;
  return (
    <React.Fragment>
      {[...text].map((c, i) => {
        const angle = ((i + 0.5) / text.length - 0.5) * 30;
        const drop = 1 - Math.cos((angle / 180) * Math.PI);
        return (
          <span
            className="curved"
            key={i}
            style={{ '--curve': `${angle}deg`, '--drop': `${drop * 500}%` }}
          >
            {c}
          </span>
        );
      })}
    </React.Fragment>
  );
}
