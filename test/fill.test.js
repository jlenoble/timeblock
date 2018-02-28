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

  it('Compacting a Timeblock', function () {
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

  it('Filling a Timeblock', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));
    const ctb = new Timeblock(today, today.clone().add(8, 'h'));

    expect(tb._children).to.have.length(0);

    expect(tb.fill(ctb)).to.be.null;
    expect(tb._children).to.have.length(1);
    expect(tb.current().format()).to.equal(
      today.clone().add(8, 'h').format());

    expect(tb.fill(ctb)).to.be.null;
    expect(tb._children).to.have.length(1);
    expect(tb.current().format()).to.equal(
      today.clone().add(8, 'h').format());

    expect(tb.fill(ctb.clone())).to.be.null;
    expect(tb._children).to.have.length(2);
    expect(tb.current().format()).to.equal(
      today.clone().add(16, 'h').format());

    expect(tb.fill(ctb.clone())).to.be.null;
    expect(tb._children).to.have.length(3);
    expect(tb.current().format()).to.equal(
      today.clone().add(24, 'h').format());

    const ntb = tb.fill(ctb.clone());
    expect(ntb).not.to.be.null;
    expect(tb._children).to.have.length(3);
    expect(tb.current().format()).to.equal(
      today.clone().add(24, 'h').format());
    expect(ntb._end.format()).to.equal(
      today.clone().add(32, 'h').format());

    tb._abandon(tb._children[tb._children.length - 1]);
    expect(tb.current().format()).to.equal(
      today.clone().add(16, 'h').format());

    const ntb2 = tb.fill(new Timeblock(today, today.clone().add(10, 'h')));
    expect(ntb2).not.to.be.null;
    expect(tb._children).to.have.length(3);
    expect(tb.current().format()).to.equal(
      today.clone().add(24, 'h').format());
    expect(ntb2._end.format()).to.equal(
      today.clone().add(26, 'h').format());
  });
});
