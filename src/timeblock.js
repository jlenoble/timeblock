import moment from 'moment';
import Twix from 'twix';

export default class Timeblock extends Twix {
  constructor (a, b) {
    // Handle self assign, but children are assign further below
    if (a instanceof Twix) {
      super(a._start, a._end);
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
        set (tb) {
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
    }
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

  _add (...args) {
    this._start.add(...args);
    this._end.add(...args);
    this._children.forEach(child => child._add(...args));
  }

  _compact () {
    let start = this._start;
    this._children.forEach(child => {
      const diff = child._start.diff(start);
      if (diff !== 0) {
        child._add(-diff);
      }
      start = child._end;
    });
  }
}
