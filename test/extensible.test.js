import {expect} from 'chai';
import moment from 'moment';
import Timeblock from '../src/timeblock';
import Extensible from '../src/extensible';

describe('Testing extensible Timeblocks', function () {
  const day1 = moment().startOf('M');
  const day2 = day1.clone().add(1, 'd');
  const span = moment.twix(day1, day2);

  it('Days within Months', function () {
    const ndays = 33.5;
    const etb = new Extensible();
    const bigtb = new Timeblock(day1, day1.clone().add({
      d: Math.floor(ndays), h: Math.floor((ndays - Math.floor(ndays)) * 24),
    }));

    expect(etb._children).to.have.length(1);
    expect(etb.lastChild().format()).to.equal(span.format());

    let overflow = etb.fill(bigtb);
    const nmonthdays = etb.length('d');
    const extradays = Math.ceil(ndays) - etb.length('d');

    expect(etb._children).to.have.length(nmonthdays);
    expect(overflow.count('d')).to.equal(extradays);
    expect(overflow._children).to.have.length(0);

    const etb2 = etb.next();
    overflow = etb2.fill(overflow);

    expect(overflow).to.be.null;
    expect(etb2._children).to.have.length(extradays);
    expect(etb2.lastChild()._children[0].length('h')).to.equal(12);
  });
});
