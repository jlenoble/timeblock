import {elements} from './element';

export default class Container {
  constructor () {
    Object.defineProperties(this, {
      [elements]: {
        value: [],
      },

      _start: {
        get () {
          const e = this[elements][0];
          return e ? e._start : 0;
        },
      },

      _end: {
        get () {
          const elts = this[elements];
          const e = elts[elts.length - 1];
          return e ? e._end : 0;
        },
      },
    });
  }

  isEmpty () {
    return !this[elements].length;
  }

  size () {
    return +this._end - this._start;
  }

  occupationSize () {
    return this[elements].reduce((s, e) => s + e.size(), 0);
  }

  freeSize () {
    return this.size() - this.occupationSize();
  }

  add (e) {
    this[elements].push(e);
  }
}
