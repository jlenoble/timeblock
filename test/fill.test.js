import {expect} from 'chai';
import moment from 'moment';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock filling', function () {
  const today = moment().startOf('d');

  it('Testing method current', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));
    expect(tb.current().format()).to.equal(today.format());

    tb.divide(2);
    expect(tb.current().format()).to.equal(tb._end.format());
  });

  it('Compacting a Timeblock - no grandchildren', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));

    tb.divide(4);
    expect(tb._children[0].format()).to.equal(moment.twix(
      today, today.clone().add(6, 'h')).format());
    expect(tb._children[1].format()).to.equal(moment.twix(
      today.clone().add(6, 'h'), today.clone().add(12, 'h')).format());
    expect(tb._children[2].format()).to.equal(moment.twix(
      today.clone().add(12, 'h'), today.clone().add(18, 'h')).format());
    expect(tb._children[3].format()).to.equal(moment.twix(
      today.clone().add(18, 'h'), today.clone().add(24, 'h')).format());

    const [child] = tb._children.splice(1, 1);
    expect(child._parent).to.equal(tb);

    expect(tb._children[0].format()).to.equal(moment.twix(
      today, today.clone().add(6, 'h')).format());
    expect(tb._children[1].format()).to.equal(moment.twix(
      today.clone().add(12, 'h'), today.clone().add(18, 'h')).format());
    expect(tb._children[2].format()).to.equal(moment.twix(
      today.clone().add(18, 'h'), today.clone().add(24, 'h')).format());
    expect(tb._children[3]).to.be.undefined;

    tb._compact();
    expect(tb._children[0].format()).to.equal(moment.twix(
      today, today.clone().add(6, 'h')).format());
    expect(tb._children[1].format()).to.equal(moment.twix(
      today.clone().add(6, 'h'), today.clone().add(12, 'h')).format());
    expect(tb._children[2].format()).to.equal(moment.twix(
      today.clone().add(12, 'h'), today.clone().add(18, 'h')).format());
    expect(tb._children[3]).to.be.undefined;

    expect(tb.current().format()).to.equal(
      today.clone().add(18, 'h').format());
  });

  it('Timeblock abandoning a child', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));

    tb.divide(4);

    const child = tb._children[1];
    tb._abandon(child);
    expect(child._parent).to.be.null;

    expect(tb._children[0].format()).to.equal(moment.twix(
      today, today.clone().add(6, 'h')).format());
    expect(tb._children[1].format()).to.equal(moment.twix(
      today.clone().add(6, 'h'), today.clone().add(12, 'h')).format());
    expect(tb._children[2].format()).to.equal(moment.twix(
      today.clone().add(12, 'h'), today.clone().add(18, 'h')).format());
    expect(tb._children[3]).to.be.undefined;

    expect(tb.current().format()).to.equal(
      today.clone().add(18, 'h').format());
  });

  it('Timeblock adopting a child', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));

    tb.divide(4);

    expect(tb._children[0].format()).to.equal(moment.twix(
      today, today.clone().add(6, 'h')).format());
    expect(tb._children[1].format()).to.equal(moment.twix(
      today.clone().add(6, 'h'), today.clone().add(12, 'h')).format());
    expect(tb._children[2].format()).to.equal(moment.twix(
      today.clone().add(12, 'h'), today.clone().add(18, 'h')).format());
    expect(tb._children[3].format()).to.equal(moment.twix(
      today.clone().add(18, 'h'), today.clone().add(24, 'h')).format());

    const child = tb._children[1];

    tb._adopt(child);
    expect(child._parent).to.equal(tb);

    expect(tb._children[0].format()).to.equal(moment.twix(
      today, today.clone().add(6, 'h')).format());
    expect(tb._children[1].format()).to.equal(moment.twix(
      today.clone().add(6, 'h'), today.clone().add(12, 'h')).format());
    expect(tb._children[2].format()).to.equal(moment.twix(
      today.clone().add(12, 'h'), today.clone().add(18, 'h')).format());
    expect(tb._children[3].format()).to.equal(moment.twix(
      today.clone().add(18, 'h'), today.clone().add(24, 'h')).format());

    expect(child).to.equal(tb._children[3]);

    expect(tb.current().format()).to.equal(
      today.clone().add(24, 'h').format());
  });
});
