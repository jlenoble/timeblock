import {expect} from 'chai';
import moment from 'moment';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock wrapping', function () {
  const today = moment().startOf('d');

  it('No intersection', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    const tb2 = tb1.clone().add(3, 'd');

    const dropped = tb1.wrap(tb2);
    expect(dropped).to.have.length(0);
    expect(tb1._children).to.have.length(0);
  });

  it('Engulfing - no previous child', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    const tb2 = new Timeblock(today.clone().add(5, 'h'),
      today.clone().add(7, 'h'));

    const dropped = tb1.wrap(tb2);
    expect(dropped).to.have.length(0);
    expect(tb1._children).to.have.length(2);
  });

  it('Engulfing - left filled with children', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    tb1.divide(4);
    const tb2 = new Timeblock(today.clone().add(5, 'h'),
      today.clone().add(7, 'h'));

    const dropped = tb1.wrap(tb2);
    expect(dropped).to.have.length(1);
    expect(tb1._children).to.have.length(6);
  });
});
