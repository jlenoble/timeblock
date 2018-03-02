const elements = Symbol('elements');
const start = Symbol('start');
const end = Symbol('end');

export default class Container {
  constructor () {
    Object.defineProperty(this, elements, {
      value: [],
    });
  }

  isEmpty () {
    return !this[elements].length;
  }

  size () {
    return this[elements].reduce((s, e) => s + e.size(), 0);
  }

  add (e) {
    this[elements].push(e);
  }
}

export class Element {
  constructor (a, b, {adapt, clone} = {}) {
    const properties = adapt ? {
      [start]: {value: adapt(a)},
      [end]: {value: adapt(b)},
    } : {
      [start]: {value: a},
      [end]: {value: b},
    };

    if (clone) {
      Object.assign(properties, {
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
    } else {
      Object.assign(properties, {
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
    }

    Object.defineProperties(this, properties);
  }

  size () {
    return +this[end] - this[start];
  }
}
