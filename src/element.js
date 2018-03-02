export const elements = Symbol('elements');
export const start = Symbol('start');
export const end = Symbol('end');

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
    ? (a, b) => ({
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
    : (a, b) => ({
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
    ? (a, b) => ({})
    : (a, b) => ({
      clone: {
        value: function () {
          throw new TypeError(
            `This Element object can't be cloned safely (no clone/adapt)`);
        },
      },
    });

  const defineProperties4 = shift
    ? (a, b) => ({})
    : (a, b) => ({
      shift: {
        value: function () {
          throw new TypeError(
            `This Element object can't be shifted (no shift)`);
        },
      },
    });

  const defineProperties5 = diff
    ? (a, b) => ({})
    : (a, b) => ({
      shiftTo: {
        value: function () {
          throw new TypeError(
            `This Element object can't be shifted (no diff)`);
        },
      },
    });

  const defineProperties = (a, b) => {
    return [defineProperties1, defineProperties2, defineProperties3,
      defineProperties4, defineProperties5].reduce((props, fn) => {
      return Object.assign(props, fn(a, b));
    }, {});
  };

  return class Element {
    constructor (a, b) {
      Object.defineProperties(this, defineProperties(a, b));
    }

    size () {
      return +this[end] - this[start];
    }

    clone () {
      return new Element(this._start, this._end);
    }

    shift (diff) {
      shift(this[start], diff);
      shift(this[end], diff);
    }

    shiftTo (value) {
      this.shift(diff(this[start], value));
    }
  };
};
