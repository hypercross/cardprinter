import React from 'react';

export function useRefState<T, R extends RefState<T> = RefState<T>>(
  t: T | (() => T),
  r?: { new (t: T): R }
) {
  return React.useState(() => {
    const Ctor = r || RefState;
    const val = typeof t === 'function' ? (t as () => T)() : t;
    return new Ctor(val) as R;
  })[0];
}

export class RefState<T> {
  private _current: T;
  private _callbacks = new Set<(now: T, prev: T) => void>();
  private _inCallback = false;

  get inCallback() {
    return this._inCallback;
  }

  constructor(t: T) {
    this._current = t;
  }

  get current() {
    return this._current;
  }

  set current(value: T) {
    if (this.inCallback) {
      throw new Error('cannot update a refstate from within its callbacks!');
    }

    if (isEqual(value, this._current)) return;

    const prev = this._current;
    this._current = value;
    this._inCallback = true;
    try {
      this._callbacks.forEach((callback) => callback(value, prev));
    } finally {
      this._inCallback = false;
    }
  }

  on(callback: (now: T, prev: T) => void) {
    this._callbacks.add(callback);
  }

  off(callback: (now: T, prev: T) => void) {
    this._callbacks.delete(callback);
  }

  setState = (value: T) => {
    this.current = value;
  };

  useState() {
    const [_, setState] = React.useState(this.current);

    React.useLayoutEffect(this.updateEffect(setState), [this, setState]);

    return this.current;
  }

  until(t: T) {
    return new Promise<void>((resolve) => {
      if (t === this.current) {
        resolve();
        return;
      }

      const cb = (now: T) => {
        if (now !== t) return;
        this.off(cb);
        resolve();
      };

      this.on(cb);
    });
  }

  updateEffect(cb: (now: T, prev: T) => void) {
    const self = this;
    return function () {
      self.on(cb);
      return function () {
        self.off(cb);
      };
    };
  }
}

function isEqual(a: any, b: any) {
  if (a === b) return true;
  //@ts-ignore
  if (a && a.equals && a.equals(b)) return true;

  if (a instanceof Array && b instanceof Array) {
    if (a.length === b.length) {
      let same = true;
      for (let i = 0; i < a.length; i++) {
        if (!isEqual(a[i], b[i])) {
          same = false;
          break;
        }
      }
      if (same) return true;
    }
  }

  return false;
}
