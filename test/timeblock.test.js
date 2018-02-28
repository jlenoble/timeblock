import {expect} from 'chai';
import moment from 'moment';
import Twix from 'twix';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock', function () {
  const today = moment().startOf('d');
  const tomorrow = today.clone().add(1, 'd');
  const todaySpan = moment.twix(today, tomorrow);
  const dayFormat = todaySpan.format();

  const hourSpans = [];
  for (let i = 0; i < 24; ++i) {
    hourSpans.push(moment.twix(today.clone().add(i, 'h'),
      today.clone().add(i+1, 'h')));
  }

  it(`format() yields ${dayFormat}`, function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    expect(tb1.format()).to.equal(dayFormat);

    const tb2 = new Timeblock(todaySpan);
    expect(tb2.format()).to.equal(dayFormat);

    const tb3 = new Timeblock(tb1);
    expect(tb3.format()).to.equal(dayFormat);
  });

  it('A Timeblock can be subdivided in equal parts', function () {
    const tb = new Timeblock(todaySpan);
    const blocks = tb.divide(24);

    expect(blocks.length).to.equal(24);
    blocks.forEach((blk, i) => {
      expect(blk).not.to.be.instanceof(Timeblock);
      expect(blk).to.be.instanceof(Twix);
      expect(blk.format()).to.equal(hourSpans[i].format());
    });

    expect(tb._children.length).to.equal(24);
    tb._children.forEach((child, i) => {
      expect(child).to.be.instanceof(Timeblock);
      expect(child.format()).to.equal(hourSpans[i].format());
    });
  });

  it('A Timeblock can be subdivided arbitrarily', function () {
    const tb = new Timeblock(todaySpan);
    const t1 = today.clone().add(3, 'h');
    const t2 = today.clone().add({h: 7, m: 25});
    const blocks0 = [
      moment.twix(today, t1),
      moment.twix(t1, t2),
      moment.twix(t2, tomorrow),
    ];

    const blocks = tb.split(t1, t2);

    expect(blocks.length).to.equal(3);
    blocks.forEach((blk, i) => {
      expect(blk).not.to.be.instanceof(Timeblock);
      expect(blk).to.be.instanceof(Twix);
      expect(blk.format()).to.equal(blocks0[i].format());
    });

    expect(tb._children.length).to.equal(3);
    tb._children.forEach((child, i) => {
      expect(child).to.be.instanceof(Timeblock);
      expect(child.format()).to.equal(blocks0[i].format());
    });
  });
});
