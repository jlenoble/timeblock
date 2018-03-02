import {expect} from 'chai';
import moment from 'moment';
import {makeElement} from '../../src/element';

describe('An Element, initialized with no adaptors', function () {
  const Element = makeElement();

  it('has a size: size method', function () {
    const e = new Element(10, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const f = new Element(now, now.clone().add(1, 'h'));
    expect(f.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(f._start).to.equal(now);
  });
});

describe('An Element, initialized with {adapt: moment}', function () {
  const Element = makeElement({adapt: moment});

  it('has a size: size method', function () {
    const e = new Element(10, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const g = new Element(now.format(), now.clone().add(1, 'h').format());
    expect(g.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(g._start).not.to.equal(now);

    const h = new Element(now, now.clone().add(1, 'h'));
    expect(h.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(h._start).not.to.equal(now);
  });
});

describe('An Element, initialized with {clone: moment}', function () {
  const Element = makeElement({clone: moment});

  it('has a size: size method', function () {
    const e = new Element(10, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const i = new Element(now.format(), now.clone().add(1, 'h').format());
    expect(i.size()).to.be.NaN;
    expect(i._start).not.to.equal(now);

    const j = new Element(now, now.clone().add(1, 'h'));
    expect(j.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(j._start).not.to.equal(now);
  });
});

const funcs = [undefined, moment];

funcs.forEach(adapt => {
  funcs.forEach(clone => {
    if (clone !== undefined || adapt !== undefined) {
      describe(`Element initialized with ${adapt && 'adapt'}/${
        clone && 'clone'}`, function () {
        const Element = makeElement({adapt, clone,
          shift: (mt, diff) => {
            mt.add(diff);
          },
          diff: (mt1, mt2) => {
            return mt2.diff(mt1);
          },
        });

        it('has a method clone', function () {
          const today = moment().startOf('d');
          const tomorrow = today.clone().add(1, 'd');
          const c = new Element(today, tomorrow);

          const d = c.clone();

          expect(d._start).not.to.equal(c._start);
          expect(d._end).not.to.equal(c._end);
          expect(d._start).to.eql(c._start);
          expect(d._end).to.eql(c._end);
        });

        it('has a method shift', function () {
          const today = moment().startOf('d');
          const tomorrow = today.clone().add(1, 'd');
          const c = new Element(today, tomorrow);

          const d = c.clone();
          d.shift(moment.duration(1, 'd'));

          expect(c._start).to.eql(today);
          expect(c._end).to.eql(tomorrow);
          expect(d._start).not.to.equal(c._end);
          expect(d._start).to.eql(tomorrow);
          expect(d._end).to.eql(tomorrow.clone().add(1, 'd'));
        });

        it('has a method shiftTo', function () {
          const today = moment().startOf('d');
          const tomorrow = today.clone().add(1, 'd');
          const c = new Element(today, tomorrow);

          const d = c.clone();
          d.shiftTo(tomorrow);

          expect(c._start).to.eql(today);
          expect(c._end).to.eql(tomorrow);
          expect(d._start).not.to.equal(c._end);
          expect(d._start).to.eql(tomorrow);
          expect(d._end).to.eql(tomorrow.clone().add(1, 'd'));
        });

        it('has a method cloneAndShift', function () {
          const today = moment().startOf('d');
          const tomorrow = today.clone().add(1, 'd');
          const c = new Element(today, tomorrow);

          const d = c.cloneAndShift(moment.duration(1, 'd'));

          expect(c._start).to.eql(today);
          expect(c._end).to.eql(tomorrow);
          expect(d._start).not.to.equal(c._end);
          expect(d._start).to.eql(tomorrow);
          expect(d._end).to.eql(tomorrow.clone().add(1, 'd'));
        });

        it('has a method cloneAndShiftTo', function () {
          const today = moment().startOf('d');
          const tomorrow = today.clone().add(1, 'd');
          const c = new Element(today, tomorrow);

          const d = c.cloneAndShiftTo(tomorrow);

          expect(c._start).to.eql(today);
          expect(c._end).to.eql(tomorrow);
          expect(d._start).not.to.equal(c._end);
          expect(d._start).to.eql(tomorrow);
          expect(d._end).to.eql(tomorrow.clone().add(1, 'd'));
        });
      });
    }
  });
});
