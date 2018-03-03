export const elements = Symbol('elements');
export const start = Symbol('start');
export const end = Symbol('end');
export const pin = Symbol('pin');

export const makeElement = ({adapt, clone, shift, diff} = {}) => {
  const defineProperties1 = adapt
    ? (a, b) => ({
      [start]: {value: adapt(a)},
      [end]: {value: adapt(b)},
    })
    : (a, b) => ({
      [start]: {value: a},
      [end]: {value: b},
    });

  const defineProperties2 = clone
    ? () => ({
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
    })
    : () => ({
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
    });

  const defineProperties3 = clone || adapt
    ? () => ({})
    : () => ({
      clone: {
        value: function () {
          throw new TypeError(
            `This Element object can't be cloned safely (no clone/adapt)`);
        },
      },
    });

  const defineProperties4 = shift
    ? () => ({})
    : () => ({
      shift: {
        value: function () {
          throw new TypeError(
            `This Element object can't be shifted (no shift)`);
        },
      },
    });

  const defineProperties5 = diff
    ? () => ({})
    : () => ({
      shiftTo: {
        value: function () {
          throw new TypeError(
            `This Element object can't be shifted (no diff)`);
        },
      },
    });

  const defineProperties = (a, b) => {
    return [defineProperties2, defineProperties3, defineProperties4,
      defineProperties5].reduce((props, fn) => {
      return Object.assign(props, fn(a, b));
    }, {});
  };

  class Element {
    constructor (a, b, ...args) {
      Object.defineProperties(this, defineProperties(a, b));
      this.initialize(a, b, ...args);
    }

    initialize (a, b) {
      Object.defineProperties(this, defineProperties1(a, b));
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
  }

  Element.adaptors = {adapt, clone, shift, diff};

  return Element;
};
