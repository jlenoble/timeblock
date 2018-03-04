const assert = d => {
  if (d <= 0) {
    throw new Error('Sizes and differences must be strictly positive');
  }
};

// When filling:
// 1) may accept: done
// 2) may accept but drop elements, parent must take charge of them
// 3) may accept on the condition it may expand, parent must decide
// 4) may refuse: parent must either relocate or crash
// 5) may accept partially, slicing splittable input
//
// 1) accept because has room to fit, may split within, may reorder
// 2) has a better affinity for input, parent must adopt
// 3) parent knows if there is a gap between, or may split to a latter gap
// 4) no room, no affinity...
// 5) has some room and block is splittable
//
// What is affinity? an ordering scheme must be devised

function makeSpanAdaptor (adaptors = {}) {
  const {diff, origin, input, output, inputD, outputD} = adaptors;

  return class SpanAdaptor {
    constructor (obj, options = {}) {
      let _a;
      let _b;
      let _d;

      const {a, b, d} = options;

      if (d !== undefined) {
        _d = d;
      }

      if (a !== undefined) {
        _a = a;
      }

      if (b !== undefined) {
        _b = b;
      }

      if (_d === undefined) {
        _d = _a !== undefined && _b !== undefined ? _b - _a : diff(obj);
      }

      assert(_d);

      if (_a === undefined) {
        _a = _b !== undefined ? _b - _d : origin(obj);
      }

      _b !== undefined || (_b = _a + _d);

      Object.defineProperties(this, {
        tag: {
          value: obj,
        },
        a: {
          get () {
            return output(_a);
          },
          set (__a) {
            const a = input(__a);
            assert(_b - a);
            _a = a;
            _b = a + _d;
          },
        },
        b: {
          get () {
            return output(_b);
          },
          set (__b) {
            const b = input(__b);
            assert(b - _a);
            _b = b;
            _a = b - _d;
          },
        },
        d: {
          get () {
            return outputD(_d);
          },
          set (__d) {
            const d = inputD(__d);
            assert(d);
            _d = d;
            _b = _a + d;
          },
        },
        _a: {
          get () {
            return _a;
          },
        },
        _b: {
          get () {
            return _b;
          },
        },
        _d: {
          get () {
            return _d;
          },
        },
      });
    }

    shift (d) {
      return new Adaptor(this.tag, {a: this._a + d, b: this._b + inputD(d)});
    }

    split (..._args) {
      const args = _args.map(input);
      let t = this._a;

      if (args.every(arg => {
        const ok = t < arg;
        t = arg;

        return ok;
      }) && t < this._b) {
        const tag = this.tag;
        t = this._a;

        const adaptors = args.map(arg => {
          const adaptor = new Adaptor(tag, {a: t, b: arg});
          t = arg;
          return adaptor;
        });

        adaptors.push(new Adaptor(tag, {a: t, b: this._b}));

        return adaptors;
      };

      return [];
    }

    isBefore (adaptor) {
      return adaptor._a > this._b;
    }

    isAfter (adaptor) {
      return adaptor._b < this._a;
    }

    wedge (adaptor) {
      if (this.isBefore(adaptor) || this.isAfter(adaptor)) {
        return [];
      }

      if (this.tag === adaptor.tag) {
        const a = this._a < adaptor._a ? this._a : adaptor._a;
        return [new Adaptor(this.tag, {a, d: this._d + adaptor._d})];
      }

      if (adaptor._a === this._b) {
        return [this, adaptor];
      }

      if (adaptor._b === this._a) {
        return [adaptor, this];
      }

      if (this._a < adaptor._a) {
        const [p, q] = this.split(adaptor._a);
        return [p, adaptor, q.shift(adaptor._d)];
      }

      return [adaptor, this.shift(adaptor._b - this._a)];
    }

    merge (adaptor) {
      return this.tag === adaptor.tag
        ? this._b === adaptor._a
          ? [new Adaptor(this.tag, {a: this._a, b: adaptor._b})]
          : []
        : [];
    }

    glue (adaptor) {
      return this.tag === adaptor.tag
        ? [new Adaptor(this.tag, {a: this._a, d: this._d + adaptor._d})]
        : [];
    }

    prepend (adaptor) {
      return adaptor.moveBefore(this);
    }

    append (adaptor) {
      return adaptor.moveAfter(this);
    }

    moveBefore (adaptor) {
      const s = this.shift(adaptor._a - this._b);
      return s.glue(adaptor) || [s, adaptor];
    }

    moveAfter (adaptor) {
      return adaptor.glue(this) || [adaptor, this.shift(adaptor._b - this._a)];
    }
  };
}

describe('', function () {
  it('', function () {

  });
});
