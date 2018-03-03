import {elements, makeElement} from './element';

export const makeContainer = ({adapt, clone, shift, diff} = {}) => {
  const Element = makeElement({adapt, clone, shift, diff});

  class Container {
    constructor () {
      Object.defineProperties(this, {
        [elements]: {
          value: [],
        },

        _start: {
          get () {
            const e = this[elements][0];
            return e !== undefined ? e._start : 0;
          },
        },

        _end: {
          get () {
            const elts = this[elements];
            const e = elts[elts.length - 1];
            return e !== undefined ? e._end : 0;
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
      if (this.isEmpty()) {
        this[elements].push(e.clone());
      } else {
        this[elements].push(e.cloneAndShiftTo(this._end));
      }
    }
  }

  return {Container, Element};
};
