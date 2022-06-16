import React from 'react';
import { RefState } from './refstate';

export type RefValue<T> = T extends RefState<infer V> ? V : T;
export type RefsValue<T extends unknown[]> = T extends [infer X, ...infer Y]
  ? [RefValue<X>, ...RefsValue<Y>]
  : [];

function getRefsValue<T extends unknown[]>(sources: T): RefsValue<T> {
  return sources.map((s) => {
    if (s instanceof RefState) return s.current;

    return s;
  }) as RefsValue<T>;
}

export function useSelector<S extends unknown[], T>(
  select: (...vals: RefsValue<S>) => T,
  ...sources: S
) {
  const [selector] = React.useState(() => new Selector(select, ...sources));
  selector.useSelectByRef(sources);
  return selector;
}

export class Selector<S extends unknown[], T> extends RefState<T> {
  public readonly params: RefState<RefsValue<S>>;
  public readonly sources: RefState<S>;

  constructor(
    public readonly select: (...vals: RefsValue<S>) => T,
    ...sources: S
  ) {
    super(null);
    const params = new RefState(getRefsValue(sources));
    this.params = params;
    this.sources = new RefState(sources);
    this.current = select(...params.current);
  }

  useSelectByRef(sources = this.sources.current) {
    React.useLayoutEffect(() => {
      const self = this;
      self.sourceOn(sources);
      self.paramsOn();
      self.sources.current = sources;
      return function () {
        self.paramsOff();
        self.sourceOff(sources);
      };
    }, [this, ...sources]);
  }

  private onSourcesChanged = () => {
    this.params.current = getRefsValue(this.sources.current);
  };

  private sourceOn(sources: S) {
    const { onSourcesChanged } = this;
    for (const src of sources) {
      if (src instanceof RefState) src.on(onSourcesChanged);
    }
    this.sources.on(onSourcesChanged);
    return this;
  }

  private sourceOff(sources: S) {
    const { onSourcesChanged } = this;
    for (const src of sources) {
      if (src instanceof RefState) src.off(onSourcesChanged);
    }
    this.sources.off(onSourcesChanged);
    return this;
  }

  private onParamsChanged = () => {
    this.current = this.select(...this.params.current);
  };

  private paramsOn() {
    this.params.on(this.onParamsChanged);
  }

  private paramsOff() {
    this.params.on(this.onParamsChanged);
  }
}
