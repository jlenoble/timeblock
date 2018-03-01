import {expect} from 'chai';
import moment from 'moment';
import Timeblock from '../src/timeblock';

describe('Testing Timeblock comparison', function () {
  const today = moment().startOf('d');

  it('isBefore', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    const tb2 = tb1.clone().add(3, 'd');

    expect(tb1.isBefore(tb2)).to.be.true;
    expect(tb2.isBefore(tb1)).to.be.false;
    expect(tb1.isBefore(tb1)).to.be.false;
  });

  it('isAfter', function () {
    const tb1 = new Timeblock(today, today.clone().add(1, 'd'));
    const tb2 = tb1.clone().add(3, 'd');

    expect(tb1.isAfter(tb2)).to.be.false;
    expect(tb2.isAfter(tb1)).to.be.true;
    expect(tb1.isBefore(tb1)).to.be.false;
  });
});
