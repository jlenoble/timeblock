import {expect} from 'chai';
import moment from 'moment';
// import Twix from 'twix';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock shifting', function () {
  const today = moment().startOf('d');

  const hourSpans = [];
  for (let i = 0; i < 24; ++i) {
    hourSpans.push(moment.twix(today.clone().add(i, 'h'),
      today.clone().add(i+1, 'h')));
  }

  it('Mutable shifting - no children, no parent', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));

    for (let i = 1; i < 4; ++i) {
      expect(tb.add(1, 'd').format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add(i + 1, 'd')
      ).format());
    }
  });

  it('Mutable shifting - children, no parent', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));
    tb.divide(3);

    for (let i = 1; i < 4; ++i) {
      expect(tb.add(1, 'd').format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add(i + 1, 'd')
      ).format());
      expect(tb._children[0].format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add({d: i, h: 8})
      ).format());
      expect(tb._children[1].format()).to.equal(moment.twix(
        today.clone().add({d: i, h: 8}),
        today.clone().add({d: i, h: 16})
      ).format());
      expect(tb._children[2].format()).to.equal(moment.twix(
        today.clone().add({d: i, h: 16}),
        today.clone().add(i + 1, 'd')
      ).format());
    }
  });

  it('Mutable shifting - no children, parent', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));
    tb.divide(3);
    const child = tb._children[0];

    expect(() => child.add(1, 'd')).to.throw();

    expect(child.format()).to.equal(moment.twix(
      today, today.clone().add(8, 'h')).format()); // Unchanged

    expect(tb.format()).to.equal(moment.twix(
      today, today.clone().add(1, 'd')).format()); // Unchanged
  });

  it('Mutable shifting - children, parent', function () {
    const tb = new Timeblock(today, today.clone().add(1, 'd'));
    tb.divide(3);
    const child = tb._children[0];
    child.divide(2);
    const grandchild = child._children[0];

    expect(() => child.add(1, 'd')).to.throw();
    expect(() => grandchild.add(1, 'd')).to.throw();

    expect(grandchild.format()).to.equal(moment.twix(
      today, today.clone().add(4, 'h')).format()); // Unchanged

    expect(child.format()).to.equal(moment.twix(
      today, today.clone().add(8, 'h')).format()); // Unchanged

    expect(tb.format()).to.equal(moment.twix(
      today, today.clone().add(1, 'd')).format()); // Unchanged

    for (let i = 1; i < 4; ++i) {
      expect(tb.add(1, 'd').format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add(i + 1, 'd')
      ).format());
      expect(child.format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add({d: i, h: 8})
      ).format());
      expect(grandchild.format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add({d: i, h: 4})
      ).format());

      expect(tb._children[0].format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add({d: i, h: 8})
      ).format());
      expect(tb._children[1].format()).to.equal(moment.twix(
        today.clone().add({d: i, h: 8}),
        today.clone().add({d: i, h: 16})
      ).format());
      expect(tb._children[2].format()).to.equal(moment.twix(
        today.clone().add({d: i, h: 16}),
        today.clone().add(i + 1, 'd')
      ).format());

      expect(tb._children[0]._children[0].format()).to.equal(moment.twix(
        today.clone().add(i, 'd'),
        today.clone().add({d: i, h: 4})
      ).format());
      expect(tb._children[0]._children[1].format()).to.equal(moment.twix(
        today.clone().add({d: i, h: 4}),
        today.clone().add({d: i, h: 8})
      ).format());
    }
  });
});
