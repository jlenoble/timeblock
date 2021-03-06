import moment from 'moment';
import Twix from 'twix';

export default class Timeblock extends Twix {
  constructor (a, b) {
    // Handle self assign, but children are assign further below
    if (a instanceof Twix) {
      super(a._oStart, a._oEnd, a.allday);
    } else if (moment.isDuration(a)) {
      const mt = moment();
      super(mt, mt.clone().add(a));
    } else {
      super(a, b);
    }

    let _children = [];
    let _parent = null;

    Object.defineProperties(this, {
      _parent: {
        get () {
          return _parent;
        },
        set (tb) { // can't change parentship through this accessor
          if (!_parent) {
            if (tb instanceof Timeblock) {
              _parent = tb;
            } else {
              throw new Error('Bad assignment type for timeblock parent');
            }
          } else {
            throw new Error('Parent of timeblock already set');
          }
        },
      },

      _transferParentship: { // Use with caution, no check
        value: tb => {
          _parent = tb;
        },
      },

      _children: {
        get () {
          return _children;
        },
        set (array) {
          _children = array.map(tw => {
            const tb = new Timeblock(tw);
            tb._parent = this;
            return tb;
          });
        },
      },

      _root: {
        get () {
          return _parent ? _parent._root : this;
        },
      },
    });

    // Properties are defined, we can copy children when applicable
    if (a instanceof Timeblock) {
      this._children = a._children; // Use accessor smart handling
      this._category = a._category;
      this._tag = a._tag;
    }
  }

  categorize (name) {
    this._category = name;
  }

  tag (name) {
    this._tag = name;
  }

  current () {
    const len = this._children.length;
    if (!len) {
      return this.start();
    }
    return this._children[len - 1].end();
  }

  clone (tb) {
    return new Timeblock(this);
  }

  add (...args) {
    if (this._parent) {
      throw new Error(
        'Timeblock has a parent and cannot be shifted independently');
    }
    this._add(...args);
    return this;
  }

  fill (tb) { // Expect any previous overflow already dealt with
    this._adopt(tb);
    const diff = this.current().diff(this._end);
    if (diff > 0) {
      if (tb._start.isSame(this._end)) {
        this._abandon(tb);
        return tb;
      } else {
        tb._oEnd = this._oEnd.clone(); // eslint-disable-line no-param-reassign
        tb._mutated();
        return new Timeblock(this._end, this._end.clone().add(diff));
      }
    } else {
      return null;
    }
  }

  insert (tb) {
    if (tb._children.length) {
      tb._children
        .map(child => child) // Make sure to work on an immutable array
        .forEach(child => this.insert(child)); // insert has side-effects
    }

    if (tb._tag) {
      const wtb = this._children.find(child => {
        return child._category === tb._tag && !child.isFull();
      });

      if (wtb) {
        wtb.fill(tb);
      }
    } else {
      return this.fill(tb);
    }
  }

  split (...args) {
    const twixes = super.split(...args);
    this._children = twixes; // set() accessor, this._children !== twixes
    return twixes;
  }

  divide (n) {
    const twixes = super.divide(n);
    this._children = twixes; // set() accessor, this._children !== twixes
    return twixes;
  }

  wrap (tb) {
    if (this.overlaps(tb)) {
      if (this.engulfs(tb)) {
        return this._wrapEngulfed(tb);
      }
    }

    return [];
  }

  isBefore (tb) {
    return this._end <= tb._start;
  }

  isAfter (tb) {
    return this._end >= tb._start;
  }

  isFull () {
    return this.current() >= this._end;
  }

  _add (...args) {
    this._oStart.add(...args);
    this._oEnd.add(...args);
    this._mutated();
    this._children.forEach(child => child._add(...args));
  }

  _compact () {
    let start = this._start;
    this._children.forEach(child => {
      const diff = start.diff(child._start);
      if (diff !== 0) {
        child._add(diff); // may overflow
      }
      start = child._end;
    });
  }

  _abandon (tb) {
    const idx = this._children.indexOf(tb);
    if (idx !== -1) {
      const [child] = this._children.splice(idx, 1);
      child._transferParentship(null);
      this._compact(); // May fix overflow, or not!
    }
  }

  _adopt (tb) {
    if (tb._parent) { // If is this, then _adopt will reorder child to the end
      tb._parent._abandon(tb);
    }
    this._children.push(tb);
    tb._transferParentship(this);
    if (this._tag) {
      tb._tag = this._tag; // eslint-disable-line no-param-reassign
    }
    this._compact(); // may overflow
  }

  _wrapEngulfed (tb) {
    if (!this._children.length) {
      if (this._start < tb._start) {
        this._adopt(new Timeblock(this._start, tb._start));
      }
      this._adopt(tb);
      return [];
    }

    let child0;
    let grandchild0;

    for (let child of this._children) {
      if (child.isBefore(tb)) {
        continue;
      }

      child0 = child;
      child.split(tb._start);
      grandchild0 = child._children[0];

      this._adopt(grandchild0);
      this._adopt(tb);
      this._adopt(child._children[0]); // 0, not 1: Was spliced

      break;
    }

    while (this._children[0] !== grandchild0) {
      this._adopt(this._children[0]); // Restack to the end
    }

    this._abandon(child0);

    return this._sliceTail();
  }

  _sliceTail () {
    const drop = this._children.filter(c => !this.engulfs(c));
    const last = drop[0];

    drop.forEach(c => this._abandon(c));

    if (last._end > this._end) {
      last.split(this._end);
      this._adopt(last._children[0]);
      drop[0] = last._children[0]; // 0, not 1: Was spliced
    }

    return drop;
  }
}
