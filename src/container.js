import {elements, makeElement} from './element';
import {makeCompactElement} from './compact-element';

export const makeContainer = ({adapt, clone, shift, diff} = {}) => {
  const Element = makeElement({adapt, clone, shift, diff});
  const CompactElement = makeCompactElement(Element);

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
      let cl = e.clone();

      if (e.isPinned()) {
        cl.pin();
      }

      if (e.isConnex()) {
        cl.connex();
      }

      if (this.isEmpty()) {
        this[elements].push(cl);
      } else if (cl.isPinned()) {
        this[elements].push(cl);
      } else {
        const elts = this[elements];
        let i = 0;

        for (let g of this.gaps()) {
          cl.shiftTo(g._start);

          if (g.size() >= cl.size()) {
            elts[i] = new CompactElement(...elts[i].points(), cl._end);
            cl = null;
            ++i;
            break;
          } else if (cl.isConnex()) {

          } else {
            cl = new Element(g._end, cl._end);
            elts[i] = new CompactElement(...elts[i].points(), g._end);
          }

          ++i;
        }

        if (i === 0) {
          const el = elts[0];
          cl.shiftTo(el._end);
          elts[0] = new CompactElement(...el.points(), cl._end);
        } else if (cl) {
          const el = elts[elts.length - 1];
          cl.shiftTo(el._end);
          elts[elts.length - 1] = new CompactElement(...el.points(), cl._end);
        }
      }
    }

    * [Symbol.iterator] () {
      for (let e of this[elements]) {
        yield* e;
      }
    }

    * gaps () {
      let e0;
      for (let e of this[elements]) {
        if (e0) {
          yield new Element(e0._end, e._start);
        }
        e0 = e;
      }
    }
  }

  return {Container, Element};
};
