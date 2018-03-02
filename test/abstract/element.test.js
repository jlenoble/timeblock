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
    describe(`Element initialized with ${adapt && 'adapt'}/${
      clone && 'clone'}`, function () {
      const Element = makeElement({adapt, clone});

      if (clone !== undefined || adapt !== undefined) {
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
      }
    });
  });
});
