export const elements = Symbol('elements');
export const start = Symbol('start');
export const end = Symbol('end');

export const makeElement = ({adapt, clone} = {}) => {
  const initProperties = adapt
    ? (a, b) => ({
      [start]: {value: adapt(a)},
      [end]: {value: adapt(b)},
    })
    : (a, b) => ({
      [start]: {value: a},
      [end]: {value: b},
    });

  const _defineProperties = clone
    ? (a, b) => {
      const properties = initProperties(a, b);
      return Object.assign(properties, {
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
      });
    }
    : (a, b) => {
      const properties = initProperties(a, b);
      return Object.assign(properties, {
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
    };

  const defineProperties = clone || adapt
    ? _defineProperties
    : (a, b) => {
      const properties = _defineProperties(a, b);
      return Object.assign(properties, {
        clone: {
          value: function () {
            throw new TypeError(
              `This Element object can't be cloned safely (no init adaptors)`);
          },
        },
      });
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
  };
};
