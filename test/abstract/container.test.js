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

  describe('when compacting Elements', function () {
    it('leaves pinned Elements untouched', function () {
      const c = new Container();
      const e = new Element(2, 7);

      const es = [
        e,
        e.cloneAndShift(10),
        e.cloneAndShift(20).pin(),
        e.cloneAndShift(30),
      ];

      es.forEach(e => {
        c.add(e);
      });

      const es2 = Array.from(c);

      expect(+es2[0]._start).to.equal(+moment(2));
      expect(+es2[1]._start).to.equal(+moment(7));
      expect(+es2[2]._start).to.equal(+moment(12));
      expect(+es2[3]._start).to.equal(+moment(22));

      expect(+es2[0]._end).to.equal(+moment(7));
      expect(+es2[1]._end).to.equal(+moment(12));
      expect(+es2[2]._end).to.equal(+moment(17));
      expect(+es2[3]._end).to.equal(+moment(27));
    });

    describe('and when a gap is not large enough', function () {
      it('tries to split the new Element across multiple gaps', function () {
        const c = new Container();
        const e = new Element(2, 7);
        const f = new Element(8, 24);

        const es = [
          e,
          e.cloneAndShift(10).pin(),
          e.cloneAndShift(20).pin(),
          f,
        ];

        es.forEach(e => {
          c.add(e);
        });

        const es2 = Array.from(c);

        expect(es2).to.have.length(6);

        expect(+es2[0]._start).to.eql(+moment(2));
        expect(+es2[1]._start).to.eql(+moment(7));
        expect(+es2[2]._start).to.eql(+moment(12));
        expect(+es2[3]._start).to.eql(+moment(17));
        expect(+es2[4]._start).to.eql(+moment(22));
        expect(+es2[5]._start).to.eql(+moment(27));

        expect(+es2[0]._end).to.eql(+moment(7));
        expect(+es2[1]._end).to.eql(+moment(12));
        expect(+es2[2]._end).to.eql(+moment(17));
        expect(+es2[3]._end).to.eql(+moment(22));
        expect(+es2[4]._end).to.eql(+moment(27));
        expect(+es2[5]._end).to.eql(+moment(33));
      });

      it('moves unpinned unsplittable new Elements to the first large enough gap', function () {
        const c = new Container();
        const e = new Element(2, 7);
        const f = new Element(8, 24);

        const es = [
          e,
          e.cloneAndShift(10).pin(),
          e.cloneAndShift(20).pin(),
          f.connex(),
        ];

        es.forEach(e => {
          c.add(e);
        });

        const es2 = Array.from(c);

        expect(es2).to.have.length(4);

        expect(+es2[0]._start).to.eql(+moment(2));
        expect(+es2[1]._start).to.eql(+moment(12));
        expect(+es2[2]._start).to.eql(+moment(22));
        expect(+es2[3]._start).to.eql(+moment(27));

        expect(+es2[0]._end).to.eql(+moment(7));
        expect(+es2[1]._end).to.eql(+moment(17));
        expect(+es2[2]._end).to.eql(+moment(27));
        expect(+es2[3]._end).to.eql(+moment(43));
      });

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
