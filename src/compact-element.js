import {elements, start, end} from './element';

export const makeCompactElement = Element => {
  const {adapt, clone, shift, diff} = Element.adaptors;

  const defineProperties1 = adapt
    ? args => ({
      [elements]: {
        value: args.map(arg => adapt(arg)),
      },
    })
    : args => ({
      [elements]: {
        value: args,
      },
    });

  const defineProperties2 = clone
    ? () => ({
      _elements: {
        get () {
          return this[elements].map(arg => clone(arg));
        },
      },
    })
    : () => ({
      _elements: {
        get () {
          return this[elements].concat();
        },
      },
    });

  const defineProperties = args => {
    return [defineProperties1, defineProperties2].reduce((props, fn) => {
      return Object.assign(props, fn(args));
    }, {});
  };

  class CompactElement extends Element {
    constructor (...args) {
      super(...args);
      Object.defineProperties(this, defineProperties(args));
    }

    initialize (...args) {
      Object.defineProperties(this, {
        [start]: {
          get () {
            return this[elements][0];
          },
        },
        [end]: {
          get () {
            const elts = this[elements];
            return elts[elts.length - 1];
          },
        },
      });
    }

    clone () {
      return new CompactElement(...this._elements);
    }

    shift (diff) {
      if (this.isPinned()) {
        throw new Error(`This Element is pinned and won't move`);
      }

      this[elements].forEach(el => shift(el, diff));
      return this;
    }
  }

  CompactElement.adaptors = Element.adaptors;

  return CompactElement;
};
