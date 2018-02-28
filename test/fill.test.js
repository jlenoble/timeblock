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
});
