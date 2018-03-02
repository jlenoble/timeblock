/* eslint-disable max-len */
import {expect} from 'chai';
import Container from '../../src/container';

describe('A Container', function () {
  it('starts empty - isEmpty method', function () {
    expect(new Container().isEmpty()).to.be.true;
  });

  it('has a size - size method');
  it('has bounds - start and end methods');

  describe('is resizable:', function () {
    it('Arbitrarily to the left');
    it('Arbitrarily to the right');
    it('It may wrap around sized Elements - autoresize');
  });

  it('has an occupationSize method');
  it('has a freeSize method');

  it('has an add method');
  it('has a remove method');
  it('has a has method');

  describe('when fitting new Elements', function () {
    it('compacts unpinned Elements to the left');
    it('introduces filler Elements between pinned non-adjacent Elements');
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

describe('A Wrapper', function () {
  it('has bounds');
  it('wraps a single element');
  it('can share its element with other wrappers');
  it('defines a span smaller or equal to its element size');
});

describe('An Element', function () {
  it('has a size');
  it('may have a value - pinning');
});
