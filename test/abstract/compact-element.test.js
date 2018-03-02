import {expect} from 'chai';
import moment from 'moment';
import {makeCompactElement} from '../../src/compact-element';

describe('A CompactElement, initialized with no adaptors', function () {
  const CompactElement = makeCompactElement();

  it('has a size: size method', function () {
    const e = new CompactElement(10, 100);
    expect(e.size()).to.equal(90);

    const now = moment();

    const f = new CompactElement(now, now.clone().add(1, 'h'));
    expect(f.size()).to.equal(moment.duration(1, 'h').asMilliseconds());
    expect(f._start).to.equal(now);
  });

  it('may have a value - pinning');
});

describe('A CompactElement, initialized with {adapt: moment}', function () {
  const CompactElement = makeCompactElement({adapt: moment});

  it('has a size: size method', function () {
    const e = new CompactElement(10, 100);
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

  it('may have a value - pinning');
});

describe('A CompactElement, initialized with {clone: moment}', function () {
  const CompactElement = makeCompactElement({clone: moment});

  it('has a size: size method', function () {
    const e = new CompactElement(10, 100);
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

  it('may have a value - pinning');
});
