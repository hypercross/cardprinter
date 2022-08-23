import React = require('react');

export function el<T extends string>(tag: T, ...classNames: string[]) {
  return function (props: React.HTMLAttributes<T>) {
    const className = `${classNames.join(' ')} ${props.className || ''}`;
    return React.createElement(tag, { ...props, className });
  } as React.FunctionComponent<React.HTMLAttributes<T>>;
}
