import {elements, start, end} from './element';

export const makeCompactElement = ({adapt, clone} = {}) => {
  const initProperties = adapt
    ? args => ({
      [elements]: {value: args.map(arg => adapt(arg))},
      [start]: {value: adapt(args[0])},
      [end]: {value: adapt(args[args.length - 1])},
    })
    : args => ({
      [elements]: {value: args},
      [start]: {value: args[0]},
      [end]: {value: args[args.length - 1]},
    });

  const defineProperties = clone
    ? args => {
      const properties = initProperties(args);
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
    : args => {
      const properties = initProperties(args);
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

  return class CompactElement {
    constructor (...args) {
      Object.defineProperties(this, defineProperties(args));
    }

    size () {
      return +this[end] - this[start];
    }
  };
};
