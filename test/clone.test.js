import {expect} from 'chai';
import moment from 'moment';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock cloning', function () {
  const today = moment().startOf('d');

  it('cloning - no children, no parent', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    const tb2 = tb1.clone();

    expect(tb1).not.to.equal(tb2);
    expect(tb1.format()).to.equal(tb2.format());
  });

  it('Cloning - children, no parent', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    tb1.divide(2);
    const tb2 = tb1.clone();

    expect(tb1).not.to.equal(tb2);
    expect(tb1.format()).to.equal(tb2.format());
    expect(tb1._children[0]).not.to.equal(tb2._children[0]);
    expect(tb1._children[0].format()).to.equal(tb2._children[0].format());
    expect(tb1._children[1]).not.to.equal(tb2._children[1]);
    expect(tb1._children[1].format()).to.equal(tb2._children[1].format());
  });

  it('Cloning - no children, parent', function () {
    const parent = new Timeblock(today, today.clone().add(1, 'd'));
    parent.divide(2);
    const child = parent._children[0];
    const tb = child.clone();

    expect(tb).not.to.equal(child);
    expect(tb.format()).to.equal(child.format());
    expect(tb._children).to.have.length(0);
    expect(child._parent).to.equal(parent);
    expect(tb._parent).to.be.null;
  });
});
