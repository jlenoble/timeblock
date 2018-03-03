export const elements = Symbol('elements');
export const start = Symbol('start');
export const end = Symbol('end');
export const pin = Symbol('pin');

export const makeElement = ({adapt, clone, shift, diff} = {}) => {
  const defineProperties = adapt
    ? (a, b) => ({
      [start]: {value: adapt(a)},
      [end]: {value: adapt(b)},
    })
    : (a, b) => ({
      [start]: {value: a},
      [end]: {value: b},
    });

  const properties = clone
    ? {
      _start: {
        get () {
          return clone(this[start]);
        },
      },
      _end: {
        get () {
          return clone(this[end]);
        },
      },
    }
    : {
      _start: {
        get () {
          return this[start];
        },
      },
      _end: {
        get () {
          return this[end];
        },
      },
    };

  const errors = {
    'cloned safely (no clone/adapt)': !clone && !adapt,
    'shifted (no shift)': !shift,
    'shifted (no diff)': !diff,
  };

  Object.keys(errors).forEach(key => {
    if (errors[key]) {
      Object.assign(properties, {
        [key.match(/^.*\Wno (\w+)\W.*$/)[1]]: {
          value: () => {
            throw new Error(`This Element instance can't be ${key}`);
          },
        },
      });
    }
  });

  class Element {
    constructor (a, b, ...args) {
      Object.defineProperties(this, properties);
      this.initialize(a, b, ...args);
    }

    initialize (a, b) {
      Object.defineProperties(this, defineProperties(a, b));
    }

    size () {
      return +this[end] - this[start];
    }

    clone () {
      return new Element(this._start, this._end);
    }

    shift (diff) {
      if (this.isPinned()) {
        throw new Error(`This Element is pinned and won't move`);
      }

      shift(this[start], diff);
      shift(this[end], diff);
      return this;
    }

    shiftTo (value) {
      return this.shift(diff(this[start], value));
    }

    cloneAndShift (diff) {
      return this.clone().shift(diff);
    }

    cloneAndShiftTo (value) {
      return this.clone().shiftTo(value);
    }

    isPinned () {
      return this[pin];
    }

    pin () {
      this[pin] = true;
      return this;
    }

    unpin () {
      this[pin] = false;
      return this;
    }

    * [Symbol.iterator] () {
      yield this.clone();
    }
  }

  Element.adaptors = {adapt, clone, shift, diff};

  return Element;
};
