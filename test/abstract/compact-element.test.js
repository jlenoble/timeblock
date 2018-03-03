/* eslint-disable no-invalid-this */
import {expect} from 'chai';
import moment from 'moment';
import {makeElement} from '../../src/element';
import {makeCompactElement} from '../../src/compact-element';

describe('A CompactElement, initialized with no adaptors', function () {
  const CompactElement = makeCompactElement(makeElement());

  it('has a size: size method', function () {
    const e = new CompactElement(10, 25, 60, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const f = new CompactElement(now, now.clone().add(1, 'h'));
    expect(f.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(f._start).to.equal(now);
  });
});

describe('A CompactElement, initialized with {adapt: moment}', function () {
  const CompactElement = makeCompactElement(makeElement({adapt: moment}));

  it('has a size: size method', function () {
    const e = new CompactElement(10, 25, 60, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const g = new CompactElement(
      now.format(), now.clone().add(1, 'h').format());
    expect(g.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(g._start).not.to.equal(now);

    const h = new CompactElement(now, now.clone().add(1, 'h'));
    expect(h.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(h._start).not.to.equal(now);
  });
});

describe('A CompactElement, initialized with {clone: moment}', function () {
  const CompactElement = makeCompactElement(makeElement({clone: moment}));

  it('has a size: size method', function () {
    const e = new CompactElement(10, 25, 60, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const i = new CompactElement(
      now.format(), now.clone().add(1, 'h').format());
    expect(i.size()).to.be.NaN;
    expect(i._start).not.to.equal(now);

    const j = new CompactElement(now, now.clone().add(1, 'h'));
    expect(j.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(j._start).not.to.equal(now);
  });
});

const funcs = [undefined, moment];

funcs.forEach(adapt => {
  funcs.forEach(clone => {
    if (clone !== undefined || adapt !== undefined) {
      describe(`CompactElement initialized with ${adapt && 'adapt'}/${
        clone && 'clone'}`, function () {
        const Element = makeCompactElement(makeElement({adapt, clone,
          shift: (mt, diff) => {
            mt.add(diff);
          },
          diff: (mt1, mt2) => {
            return mt2.diff(mt1);
          },
        }));

        beforeEach(function () {
          const today = moment().startOf('d');
          const tomorrow = today.clone().add(1, 'd');
          const yesterday = today.clone().add(-1, 'd');
          const c = new Element(yesterday, today, tomorrow);

          const d = c.clone();

          const shiftTest = d => {
            expect(c._start).to.eql(yesterday);
            expect(c._end).to.eql(tomorrow);
            expect(d._start).not.to.equal(c._end);
            expect(d._start).to.eql(tomorrow);
            expect(d._end).to.eql(tomorrow.clone().add(2, 'd'));
          };

          this.today = today;
          this.tomorrow = tomorrow;
          this.yesterday = yesterday;
          this.c = c;
          this.d = d;
          this.shiftTest = shiftTest;
        });

        it('has a method clone', function () {
          const {c, d} = this;

          expect(d._start).not.to.equal(c._start);
          expect(d._end).not.to.equal(c._end);
          expect(d._start).to.eql(c._start);
          expect(d._end).to.eql(c._end);
        });

        it('has a method shift', function () {
          this.d.shift(moment.duration(2, 'd'));
          this.shiftTest(this.d);
        });

        it('has a method shiftTo', function () {
          this.d.shiftTo(this.tomorrow);
          this.shiftTest(this.d);
        });

        it('has a method cloneAndShift', function () {
          const d = this.c.cloneAndShift(moment.duration(2, 'd'));
          this.shiftTest(d);
        });

        it('has a method cloneAndShiftTo', function () {
          const d = this.c.cloneAndShiftTo(this.tomorrow);
          this.shiftTest(d);
        });
      });
    }
  });
});
