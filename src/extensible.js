import {Day, Month} from './iterable';

const makeExtensible = (Parent, Child) => {
  class Extensible extends Parent {
    constructor (start) {
      super(start);
      super._adopt(new Child(start));
    }

    maxChildren () {
      return this.length(Child.tag);
    }

    lastChild () {
      return this._children[this._children.length - 1];
    }

    fill (tb) {
      const lastChild = this.lastChild();
      let overflow = lastChild.fill(tb);

      if (overflow) {
        if (this._children.length >= this.maxChildren()) {
          return overflow;
        }

        const newChild = lastChild.next();
        this._adopt(newChild);
        overflow = newChild.fill(overflow);

        if (overflow) {
          return this.fill(overflow);
        }
      }

      return null;
    }
  };

  return Extensible;
};

export default makeExtensible(Month, Day);
