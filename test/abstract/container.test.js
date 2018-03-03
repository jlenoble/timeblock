/* eslint-disable max-len */
import {expect} from 'chai';
import moment from 'moment';
import {makeContainer} from '../../src/container';

const {Container, Element} = makeContainer({
  adapt: moment,
  clone: moment,
  shift: (mt, diff) => {
    mt.add(diff);
  },
  diff: (mt1, mt2) => mt2.diff(mt1),
});

describe('A Container', function () {
  it('starts empty - isEmpty method', function () {
    expect(new Container().isEmpty()).to.be.true;
  });

  it('has a size - size method', function () {
    expect(new Container().size()).to.equal(0);
  });

  it('has bounds', function () {
    const c = new Container();
    const e = new Element(2, 7);
    expect(c._start).to.equal(0);
    expect(c._end).to.equal(0);
    c.add(e);
    expect(c._start).to.eql(e._start);
    expect(c._end).to.eql(e._end);
  });

  it('is resizable', function () {
    const c = new Container();
    const e = new Element(2, 7);
    expect(c.size()).to.equal(0);
    expect(e.size()).to.equal(5);
    c.add(e);
    expect(c.size()).to.equal(5);
  });

  it('has an occupationSize method', function () {
    const c = new Container();
    const e = new Element(2, 7);
    c.add(e);
    expect(c.occupationSize()).to.equal(5);
  });

  it('has a freeSize method', function () {
    const c = new Container();
    const e = new Element(2, 7);
    c.add(e);
    expect(c.freeSize()).to.equal(0);
  });

  it('has an add method', function () {
    const c = new Container();
    const e = new Element(2, 7);

    expect(c.isEmpty()).to.be.true;
    c.add(e);
    expect(c.isEmpty()).to.be.false;

    expect(c.size()).to.equal(5);
  });

  it('has a remove method');
  it('has a has method');

  describe('when fitting new Elements', function () {
    it('compacts unpinned Elements to the left', function () {
      const c = new Container();
      const e = new Element(2, 7);

      c.add(e);
      c.add(e);
      c.add(e);
      c.add(e);

      expect(c.size()).to.equal(20);
      expect(c.occupationSize()).to.equal(20);
      expect(c.freeSize()).to.equal(0);
    });

    it('leaves untouched pinned non-adjacent Elements', function () {
      const c = new Container();
      const e = new Element(2, 7);

      c.add(e.pin());
      c.add(e.cloneAndShift(10).pin());
      c.add(e.cloneAndShift(20).pin());
      c.add(e.cloneAndShift(30).pin());

      expect(c.size()).to.equal(35);
      expect(c.occupationSize()).to.equal(20);
      expect(c.freeSize()).to.equal(15);
    });
  });

  it('has resizable unpinned filler Elements');

  describe('when compacting Elements', function () {
    it('leaves pinned Elements untouched');
    it('shrinks filler Elements to fit new Elements if possible');

    describe('and when a filler Element is not large enough', function () {
      it('tries to split the new Element across multiple gaps');
      it('moves unpinned unsplittable new Elements to the first large enough gap');
      it('throws an error when two pinned Elements collide');
    });
  });

  describe('can be merged with another Container - concat:', function () {
    it('Compacting is done with the left strategy');
    it('Collisions of pinned Elements raise errors');
    it('Both Containers remain untouched');
    it('Newly adjacent Elements are merged if they are equivalent');
  });

  it('has a concatenation strategy');
  it('provides a generator to access its (wrapped/copied) Elements');
});
